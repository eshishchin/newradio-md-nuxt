   function createStars() {
            const starContainer = document.querySelector('.stars');
            for (let i = 0; i < 150; i++) {
                let star = document.createElement('div');
                star.classList.add('star');
                star.style.top = `${Math.random() * 100}vh`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.animationDuration = `${Math.random() * 2 + 1}s`;
                starContainer.appendChild(star);
            }
        }

        function createPlanets() {
            const planetContainer = document.querySelector('.planets');
            for (let i = 0; i < 5; i++) {
                let planet = document.createElement('div');
                planet.classList.add('planet');
                planet.style.width = `${Math.random() * 50 + 40}px`;
                planet.style.height = planet.style.width;
                planet.style.top = `${Math.random() * 80}vh`;
                planet.style.left = `${Math.random() * 80}vw`;
                planet.style.animationDuration = `${Math.random() * 6 + 6}s`;
                planetContainer.appendChild(planet);
            }
        }

        createStars();
        createPlanets();
