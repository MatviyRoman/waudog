window.addEventListener("load", function() {
    
    function isIOS() {
        return ['iPhone', 'iPad', 'iPod'].some(device => navigator.platform.includes(device)) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }
    function isMac() {
        return navigator.platform.toUpperCase().includes("MAC");
    }


    if (isIOS()) {
        document.body.classList.add('ios-device');
        document.documentElement.classList.add('ios-device');
    }

    if (isMac()) {
        document.body.classList.add('mac-device');
        document.documentElement.classList.add('mac-device');
    }



    searchHeader();
    function searchHeader() {
        const searchElement = document.querySelector('.header-center__search');
        document.addEventListener('click', function(event) {
            if (!searchElement.contains(event.target)) {
                searchElement.classList.remove('active');
                searchElement.classList.remove('show-result-main');
                searchElement.classList.remove('show-result-history');
                searchElement.classList.remove('show-result-empty');
                if(document.querySelector('.header-center__search_results_main_res')) {
                    document.querySelector('.header-center__search_results_main_res').remove();
                }
                if(document.querySelector('.header-center__search_results_history_res')) {
                    document.querySelector('.header-center__search_results_history_res').remove();
                }
                let inputs = searchElement.querySelectorAll('input');
                inputs.forEach(function (t) {
                    t.value = '';
                })
            } else {
                searchElement.classList.add('active');
            }
        });
        const searchInput = searchElement.querySelector('input');
        searchInput.addEventListener('keyup', function() {
            const controlKeyCodes = [
                16, 17, 18, 20, 91, 92, 93, 9, 27, 13, 33, 34, 35, 36, 37, 38, 39, 40, 112,113,114,115,116,117,118,119,120,121,122,123
            ];
            if (controlKeyCodes.includes(event.keyCode) ||
                event.ctrlKey ||
                event.altKey ||
                event.metaKey) {
                return;
            }
            const inputValue = this.value.trim();

            if (inputValue.length >= 3) {
                performSearch(inputValue);
            }
        });

        const clearHistory = document.querySelector('.header-center__search_results_history_clear');
        clearHistory.addEventListener('click', function(event) {
            removeAllSearchHistory();
        });


        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('header-center__search_results_history_res_clear')) {
                removeCurrentSearchHistory(event.target);
            }
        });


        function performSearch(query) {
            if(query === 'result') {
                showSearchResult();
            } else if(query === 'history') {
                showSearchHistory();
            } else {
                showSearchEmpty();
            }
        }
        
        function showSearchResult() {
            const div = document.createElement('div');
            div.classList.add('header-center__search_results_main_res');
            div.innerHTML = `<a href="#" class="header-center__search_results_main_res_item">Нашийники</a><a href="#" class="header-center__search_results_main_res_item">Шкіряні нашийники</a><a href="#" class="header-center__search_results_main_res_item">Нашийники з підсвідкою</a>`;

            document.querySelector('.header-center__search_results_main').appendChild(div);

            document.querySelector('.header-center__search').classList.add('show-result-main');
            document.querySelector('.header-center__search').classList.remove('show-result-empty');
        }
        function showSearchHistory() {
            const div = document.createElement('div');
            div.classList.add('header-center__search_results_history_res');
            div.innerHTML = `
                            <div class="header-center__search_results_history_res_wrap">
                                   <a href="#" class="header-center__search_results_history_res_item">Нашийники</a>
                                  <div class="header-center__search_results_history_res_clear"></div>
                             </div>
                             <div class="header-center__search_results_history_res_wrap"><a href="#" class="header-center__search_results_history_res_item">Шкіряні нашийники</a><div class="header-center__search_results_history_res_clear"></div></div>
                             <div class="header-center__search_results_history_res_wrap"><a href="#" class="header-center__search_results_history_res_item">Нашийники з підсвідкою</a><div class="header-center__search_results_history_res_clear"></div></div>
                            `;

            document.querySelector('.header-center__search_results_history').appendChild(div);

            document.querySelector('.header-center__search').classList.add('show-result-history');
            document.querySelector('.header-center__search').classList.remove('show-result-empty');
        }
        function showSearchEmpty() {
            if(document.querySelector('.header-center__search_results_main_res')) {
                document.querySelector('.header-center__search_results_main_res').remove();
            }
            if(document.querySelector('.header-center__search_results_history_res')) {
                document.querySelector('.header-center__search_results_history_res').remove();
            }
            document.querySelector('.header-center__search').classList.remove('show-result-main');
            document.querySelector('.header-center__search').classList.remove('show-result-history');
            document.querySelector('.header-center__search').classList.add('show-result-empty');
        }

        function removeAllSearchHistory() {
            searchElement.classList.remove('show-result-history');
            if(document.querySelector('.header-center__search_results_history_res')) {
                document.querySelector('.header-center__search_results_history_res').remove();
            }
        }
        function removeCurrentSearchHistory(item) {
          item.parentNode.remove();
        }
    }

    headerBottomList();
    function headerBottomList() {
        let items = document.querySelectorAll('.header-bottom__list_hidden');
        items.forEach(function (elem) {
            elem.parentElement.classList.add('has-hidden-list');
        })
    }

    mobileHiddenList();
    function mobileHiddenList() {
        let items = document.querySelectorAll('.header-hidden-menu__hidden_nav_list_hidden');
        items.forEach(function (elem) {
            elem.previousElementSibling.classList.add('has-hidden-list');
        })
    }


    function mobileMenu() {
        let buttonOpen = document.querySelectorAll('.button-show-mobile-menu');
        buttonOpen.forEach(function (elem) {
            elem.addEventListener('click', menuOpen);
        });
        let buttonClose = document.querySelectorAll('.header-hidden-menu__top_close_main, .header-hidden-menu__hidden_buttons_nav_close');
        buttonClose.forEach(function (elem) {
            elem.addEventListener('click', menuClose);
        });

    }
    mobileMenu();

    function menuOpen() {
        if(window.innerWidth <= 991) {
            if (!document.querySelector('.blur-section')) {
                const blurSection = document.createElement('div');
                blurSection.className = 'blur-section';
                blurSection.style.display = 'block';
                document.body.appendChild(blurSection);
                blurSection.addEventListener('click', menuClose);
            }
            setTimeout(function () {
                document.documentElement.classList.add('blur');
            },0);
            setTimeout(function () {
                document.documentElement.classList.add('menu-open');
            },155)
        }
    }
    function menuClose() {
        document.documentElement.classList.remove('menu-open');
        setTimeout(function () {
            document.documentElement.classList.remove('blur');
            const blurSection = document.querySelector('.blur-section');
            if (blurSection) {
                blurSection.remove();
            }
            let nestingNav = document.querySelectorAll('.show-list');
            nestingNav.forEach(function (t) {
                t.classList.remove('show-list');
            })
        },155);
    }


    function mobileHiddenMenu() {
        let buttons = document.querySelectorAll('.has-list');
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let className = button.getAttribute('data-list');
                console.log(className)
                document.querySelector('.' + className).classList.add('show-list');
            });

        });
        let buttonsHidden = document.querySelectorAll('.has-hidden-list');
        buttonsHidden.forEach(function (button) {
            button.addEventListener('click', function () {
                button.parentElement.querySelector('.header-hidden-menu__hidden_nav_list_hidden').classList.add('show-list');
            });

        });

        let backButtons = document.querySelectorAll('.header-hidden-menu__hidden_buttons_nav_back');
        backButtons.forEach(function (t) {
            t.addEventListener('click', function () {
                const parent = t.closest('.show-list');
                if (parent) {
                    parent.classList.remove('show-list');
                }
            });

        });

        function dragMainMenu() {
            const dragButton = document.querySelector('.header-hidden-menu__top_close_additional');
            const menu = document.querySelector('.header-hidden-menu');
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            dragButton.addEventListener('touchstart', function(e) {
                if (window.innerWidth <= 991) { // только для мобильных
                    startY = e.touches[0].clientY;
                    currentY = 0;
                    isDragging = true;
                    menu.style.transition = 'none'; // убираем анимацию при драге
                }
            });

            dragButton.addEventListener('touchmove', function(e) {
                if (!isDragging) return;

                const touchY = e.touches[0].clientY;
                currentY = touchY - startY;

                if (currentY > 0) {
                    menu.style.transform = `translateY(${currentY}px)`;
                }
            });

            dragButton.addEventListener('touchend', function() {
                if (!isDragging) return;
                isDragging = false;

                menu.style.transition = 'transform 0.15s';

                menu.removeAttribute('style');
                if (currentY > 60) {

                    menuClose();
                }

            });

        }
        dragMainMenu();


        function dragHiddenMenu() {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;
            let currentParent = null;

            document.addEventListener('touchstart', function(e) {
                if (window.innerWidth > 991) return;

                const target = e.target;
                const dragButton = target.closest('.header-hidden-menu__hidden_buttons_line');

                if (!dragButton) return;

                const parent = dragButton.closest('.show-list');
                if (!parent) return;

                currentParent = parent;
                startY = e.touches[0].clientY;
                currentY = 0;
                isDragging = true;
                parent.style.transition = 'none';
            });

            document.addEventListener('touchmove', function(e) {
                if (!isDragging || !currentParent) return;

                const touchY = e.touches[0].clientY;
                currentY = Math.max(0, touchY - startY);
                currentParent.style.transform = `translateY(${currentY}px)`;
            });

            document.addEventListener('touchend', function() {
                if (!isDragging || !currentParent) return;

                isDragging = false;
                currentParent.style.transition = 'transform 0.15s';
                currentParent.removeAttribute('style');
                if (currentY > 60) {
                    currentParent.classList.remove('show-list');
                }

                currentParent = null;
            });
        }

        dragHiddenMenu();

    }
    mobileHiddenMenu();


















    let firstInit = true;
    if (window.innerWidth <= 992) {
        if(firstInit) {
            firstInit = false;

        }
    }


    mainHeight();
    function mainHeight() {
        let windowHeight = window.innerHeight;
        let header = document.querySelector('header')?.offsetHeight ?? 0;
        let mainElement = document.querySelector('main');
        let main = mainElement?.offsetHeight ?? 0;
        let footer = document.querySelector('footer')?.offsetHeight ?? 0;

        if (mainElement) {
            let availableHeight = windowHeight - header - footer;
            mainElement.style.minHeight = availableHeight / 16 + 'rem';
        }
    }

    hiddenNavHeight();
    function hiddenNavHeight() {
        let top = document.querySelector('.header-hidden-menu__top')?.offsetHeight ?? 0;
        let center = document.querySelector('.header-hidden-menu__center');
        let bottom = document.querySelector('.header-hidden-menu__bottom')?.offsetHeight ?? 0;

        if (center) {
            if (window.innerWidth <= 992) {
                center.style.top = top / 16 + 'rem';
                center.style.bottom = bottom / 16 + 'rem';
            } else {
                center.removeAttribute('style');
            }

        }
    }

    function removeMobileOpenMenu() {
        if (window.innerWidth >= 992) {
            let showList = document.querySelectorAll('.show-list');
            showList.forEach(function (t) {
                t.classList.remove('show-list');
            });
            if (document.documentElement.classList.contains('menu-open')) {
                document.documentElement.classList.remove('menu-open');
                document.documentElement.classList.remove('blur');
                const blurSection = document.querySelector('.blur-section');
                if (blurSection) {
                    blurSection.remove();
                }
            }
        }
    }
    removeMobileOpenMenu();


    function showModals() {
        const modalButton = document.querySelectorAll('.modal-button');
        modalButton.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                openModal(modalId);
            });
        });

        function openModal(modalId) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
                modal.classList.remove('visible');
            });

            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.style.display = 'flex';
                setTimeout(() => {
                    targetModal.classList.add('visible');
                }, 0);
            }
        }

        const closeModalButton = document.querySelectorAll('.modal-close__button, .modal-close__bg');
        closeModalButton.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('visible');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    },150);
                });
            });
        });


    }
    showModals();

    function showPassword() {
        const showPasswordButtons = document.querySelectorAll('.show-password');
        showPasswordButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const inputField = button.parentNode.querySelector('input');

                if (inputField.type === 'password') {
                    inputField.setAttribute('type', 'text');
                    button.classList.add('visible');
                } else {
                    inputField.setAttribute('type', 'password');
                    button.classList.remove('visible');
                }
            });
        });
    }
    showPassword();


    window.onresize = function () {
        mainHeight();
        hiddenNavHeight();
        removeMobileOpenMenu();
        if (window.innerWidth <= 992) {
            if(firstInit) {
                firstInit = false;
            }
        }

    }
});