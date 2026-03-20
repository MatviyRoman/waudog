window.addEventListener("load", function() {
    const itemsImgParent = document.querySelectorAll('.item-wrap__top_img_hidden');

    itemsImgParent.forEach((parent) => {
        const itemsImg = parent.querySelectorAll('img');
        if(itemsImg.length > 1 && !parent.parentNode.parentNode.querySelector('.item-wrap__top_nav')) {
            const newDiv = document.createElement('div');
            newDiv.className = 'item-wrap__top_nav';
            parent.parentNode.parentNode.appendChild(newDiv);
        }
        itemsImg.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            const hasNav = item.closest('.item-wrap__top').querySelector('.item-wrap__top_nav');
            if(hasNav) {
                const navItem = document.createElement('div');
                navItem.className = 'item-wrap__top_nav_item';
                if(index == 0) navItem.classList.add('active');
                hasNav.appendChild(navItem);
            }
        });
    });

    const navItems = document.querySelectorAll('.item-wrap__top_nav_item');
    navItems.forEach(item => {
        const topBlock = item.closest('.item-wrap__top');
        const imgBlock = topBlock.querySelector('.item-wrap__top_img_hidden');
        const localItems = topBlock.querySelectorAll('.item-wrap__top_nav_item');
        item.addEventListener('click', () => {
            const localIndex = Array.from(localItems).indexOf(item);
            imgBlock.style.transform = `translateX(-${localIndex * 100}%)`;
            localItems.forEach(disabled => disabled.classList.remove('active'));
            item.classList.add('active');
        });
    });

    let swipeEnabled = false;

    function initSwipeEvents() {
        if (window.innerWidth < 992 && !swipeEnabled) {
            swipeEnabled = true;
            itemsImgParent.forEach(enableSwipeOnParent);
        }

        if (window.innerWidth >= 992 && swipeEnabled) {
            swipeEnabled = false;
            itemsImgParent.forEach(disableSwipeOnParent);
        }
    }


    function enableSwipeOnParent(parent) {
        const itemsImg = parent.querySelectorAll('img');
        if (itemsImg.length <= 1) return;

        let startX = 0, currentX = 0, isDragging = false;
        let currentTranslate = 0, previousTranslate = 0;
        let currentIndex = 0;

        const topBlock = parent.closest('.item-wrap__top');
        const allNavItems = topBlock.querySelectorAll('.item-wrap__top_nav_item');
        const activeNavItem = topBlock.querySelector('.item-wrap__top_nav_item.active');
        currentIndex = Array.from(allNavItems).indexOf(activeNavItem);


        const handlers = {
            touchstart(e) {
                startX = e.touches[0].clientX;
                isDragging = true;

                const computedStyle = window.getComputedStyle(parent);
                const matrix = new DOMMatrixReadOnly(computedStyle.transform);
                previousTranslate = currentTranslate = matrix.m41;

                parent.style.transition = 'none';

                const scrollableParent = findScrollableParent(parent);
                if (scrollableParent) {
                    scrollableParent.style.touchAction = 'pan-y';
                    scrollableParent.style.overflowX = 'hidden';
                }

                e.stopPropagation();
            },
            touchmove(e) {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diffX = currentX - startX;

                const maxTranslate = 0;
                const minTranslate = -(parent.scrollWidth - parent.clientWidth);

                currentTranslate = previousTranslate + diffX;

                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate;
                } else if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate;
                }

                parent.style.transform = `translateX(${currentTranslate}px)`;

                e.preventDefault();
                e.stopPropagation();
            },
            touchend(e) {
                if (!isDragging) return;
                isDragging = false;

                const scrollableParent = findScrollableParent(parent);
                if (scrollableParent) {
                    scrollableParent.style.touchAction = '';
                    scrollableParent.style.overflowX = '';
                }

                const diffX = currentX - startX;
                const minSwipeDistance = 20;
                const slideWidth = parent.clientWidth;

                let newIndex = currentIndex;

                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0 && currentIndex > 0) {

                        newIndex = currentIndex - 1;
                    } else if (diffX < 0 && currentIndex < allNavItems.length - 1) {

                        newIndex = currentIndex + 1;
                    }
                }

                parent.style.transition = 'transform 0.3s ease';
                parent.style.transform = `translateX(-${newIndex * slideWidth}px)`;

                allNavItems.forEach(item => item.classList.remove('active'));
                allNavItems[newIndex].classList.add('active');

                currentIndex = newIndex;
                currentTranslate = -newIndex * slideWidth;

                e.stopPropagation();
            }
        };

        parent._swipeHandlers = handlers;
        parent.addEventListener('touchstart', handlers.touchstart, { passive: false });
        parent.addEventListener('touchmove', handlers.touchmove, { passive: false });
        parent.addEventListener('touchend', handlers.touchend);
    }

    function disableSwipeOnParent(parent) {
        const handlers = parent._swipeHandlers;
        if (!handlers) return;

        parent.removeEventListener('touchstart', handlers.touchstart);
        parent.removeEventListener('touchmove', handlers.touchmove);
        parent.removeEventListener('touchend', handlers.touchend);

        delete parent._swipeHandlers;

        parent.style.transition = '';
        parent.style.transform = '';

        const topBlock = parent.closest('.item-wrap__top');
        const navItems = topBlock.querySelectorAll('.item-wrap__top_nav_item');
        navItems.forEach((elem, index) => {
            elem.classList.remove('active');
            if (index === 0) elem.classList.add('active');
        });

        parent.style.transform = 'translateX(0%)';
    }

    function findScrollableParent(element) {
        let parent = element.parentElement;
        while (parent) {
            const style = window.getComputedStyle(parent);
            if (style.overflowX === 'scroll' || style.overflowX === 'auto') {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    initSwipeEvents();

    window.addEventListener('resize', initSwipeEvents);
});