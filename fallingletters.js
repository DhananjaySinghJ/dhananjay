        class TextShatterEffect {
            constructor() {
                this.engine = Matter.Engine.create({
                    enableSleeping: false,
                    constraintIterations: 4
                });
                
                this.world = this.engine.world;
                this.world.gravity.y = 1;

                this.render = Matter.Render.create({
                    element: document.body,
                    engine: this.engine,
                    options: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        background: 'transparent',
                        wireframes: false,
                        pixelRatio: window.devicePixelRatio
                    }
                });

                this.textElement = document.getElementById('text');
                this.particles = [];
                this.isShattered = false;
                this.lastScrollY = window.scrollY;
                this.scrollVelocity = 0;

                this.init();
                this.addEventListeners();
                this.updatePhysics();
            }

            init() {
                // Split text into characters
                this.splitText();
                
                // Create ground
                this.ground = Matter.Bodies.rectangle(
                    window.innerWidth / 2,
                    window.innerHeight + 50,
                    window.innerWidth,
                    100,
                    { 
                        isStatic: true,
                        render: { visible: false }
                    }
                );
                Matter.World.add(this.world, this.ground);

                // Start render engine
                Matter.Render.run(this.render);
            }

            splitText() {
                const text = this.textElement.textContent;
                this.textElement.innerHTML = '';
                this.chars = text.split('').map(char => {
                    const span = document.createElement('span');
                    span.className = 'char-wrapper';
                    span.textContent = char;
                    span.style.color = '#EB4330';
                    this.textElement.appendChild(span);
                    return span;
                });
            }

            createLetterTexture(char, width, height) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.font = `normal ${height}px system-ui`;
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(char, width / 2, height / 2);
                return canvas.toDataURL();
            }

            createParticles() {
                this.chars.forEach(charElement => {
                    if (charElement.textContent.trim() === '') return;

                    const rect = charElement.getBoundingClientRect();
                    const body = Matter.Bodies.rectangle(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        rect.width,
                        rect.height,
                        {
                            restitution: 0.8 + Math.random() * 0.2,
                            friction: 0.2,
                            frictionAir: 0.002,
                            render: {
                                sprite: {
                                    texture: this.createLetterTexture(
                                        charElement.textContent,
                                        rect.width,
                                        rect.height
                                    )
                                }
                            }
                        }
                    );

                    Matter.World.add(this.world, body);
                    this.particles.push({
                        body,
                        element: charElement,
                        originalPosition: {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2
                        }
                    });
                });

                // Initially set gravity to zero
                this.world.gravity.y = 0;

                // Add gravity after explosion
                setTimeout(() => {
                    this.world.gravity.y = 0.5;
                }, 100);
            }

            addEventListeners() {
                window.addEventListener('scroll', this.handleScroll.bind(this));
                window.addEventListener('resize', () => {
                    this.render.canvas.width = window.innerWidth;
                    this.render.canvas.height = window.innerHeight;
                    if (this.isShattered) {
                        this.cleanupParticles();
                        this.createParticles();
                    }
                });
            }

            handleScroll() {
                const currentScrollY = window.scrollY;
                this.scrollVelocity = currentScrollY - this.lastScrollY;
                this.lastScrollY = currentScrollY;

                const scrollProgress = currentScrollY / (document.documentElement.scrollHeight - window.innerHeight);
                
                if (!this.isShattered && scrollProgress > 0.2) {
                    this.isShattered = true;
                    this.textElement.style.color = '#FFFFFF'; // Change color to white
                    this.textElement.style.opacity = 0; // Make text disappear
                    this.createParticles();
                    Matter.Engine.run(this.engine);
                } else if (this.isShattered && scrollProgress < 0.2) {
                    this.isShattered = false;
                    this.reassembleText();
                } else if (this.isShattered && scrollProgress > 0.6) {
                    this.fadeAwayParticles();
                }
            }

            reassembleText() {
                this.textElement.style.opacity = 1;
                this.cleanupParticles();
            }

            fadeAwayParticles() {
                this.particles.forEach((particle, index) => {
                    setTimeout(() => {
                        const force = 0.05;
                        Matter.Body.applyForce(particle.body, particle.body.position, {
                            x: (Math.random() - 0.5) * force,
                            y: -force
                        });
                        setTimeout(() => {
                            Matter.World.remove(this.world, particle.body);
                        }, 1000);
                    }, index * 50);
                });
            }

            cleanupParticles() {
                this.particles.forEach(particle => {
                    Matter.World.remove(this.world, particle.body);
                });
                this.particles = [];
            }

            updatePhysics() {
                Matter.Engine.update(this.engine, 1000 / 60);

                if (this.isShattered) {
                    this.particles.forEach(particle => {
                        const force = this.scrollVelocity * 0.0001;
                        Matter.Body.applyForce(particle.body, particle.body.position, {
                            x: force * (Math.random() - 0.5),
                            y: force * (Math.random() - 0.5)
                        });
                    });
                }

                requestAnimationFrame(this.updatePhysics.bind(this));
            }
        }

        // Initialize the effect when the page loads
        window.addEventListener('load', () => {
            new TextShatterEffect();
        });
