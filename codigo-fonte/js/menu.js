const wrapper = document.getElementById('wrapper');
        const wheel = document.getElementById('wheel');
        const toggleBtn = document.getElementById('toggleBtn');
        let items = Array.from(document.querySelectorAll('.item'));
        const radius = 180;
        
        let currentRotation = 90; 
        let isSpinning = false;
        let startX = 0;
        let dragSrcEl = null;

        //  Alternar estado retrátil
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('retracted');
            toggleBtn.innerText = wrapper.classList.contains('retracted') ? 'ABRIR MENU' : 'FECHAR MENU';
        });

        //  Posicionamento e Rotação
        function updateLayout() {
            items.forEach((item, index) => {
                const angle = (index / (items.length - 1)) * 180;
                const radian = (angle - 180) * (Math.PI / 180);
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;
                
                const visualRotation = currentRotation - 90;
                item.style.transform = `translate(${x}px, ${y}px) rotate(${-visualRotation}deg)`;
                item.setAttribute('data-base-x', x);
                item.setAttribute('data-base-y', y);
            });
        }

        function rotate(delta) {
            currentRotation += delta;
            if (currentRotation > 180) currentRotation = 180;
            if (currentRotation < 0) currentRotation = 0;
            wheel.style.transform = `rotate(${currentRotation - 90}deg)`;
            updateLayout();
        }

        //  Drag & Drop
        function handleDragStart(e) {
            dragSrcEl = this;
            this.classList.add('dragging-order');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            isSpinning = false;
        }

        function handleDragOver(e) { if (e.preventDefault) e.preventDefault(); return false; }
        function handleDragEnter() { this.classList.add('over'); }
        function handleDragLeave() { this.classList.remove('over'); }

        function handleDrop(e) {
            if (e.stopPropagation) e.stopPropagation();
            if (dragSrcEl !== this) {
                dragSrcEl.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }
            return false;
        }

        function handleDragEnd() {
            items.forEach(item => item.classList.remove('over', 'dragging-order'));
        }

        //  Eventos de Mouse e Touch
        window.addEventListener('mousedown', (e) => {
            if(e.target.closest('.wheel') || e.target === document.body) {
                isSpinning = true;
                startX = e.clientX;
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSpinning) return;
            rotate((startX - e.clientX) * 0.3);
            startX = e.clientX;
        });

        window.addEventListener('mouseup', () => isSpinning = false);
        window.addEventListener('wheel', (e) => rotate(e.deltaY * 0.05));

        // Touch Mobile
        window.addEventListener('touchstart', (e) => {
            if(e.target.closest('.wheel')) {
                isSpinning = true;
                startX = e.touches[0].clientX;
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (!isSpinning) return;
            rotate((startX - e.touches[0].clientX) * 0.5);
            startX = e.touches[0].clientX;
        });

        window.addEventListener('touchend', () => isSpinning = false);

        // Inicializar eventos de drag
        items.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('dragleave', handleDragLeave);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
        });

        updateLayout();