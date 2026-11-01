(function () {
 document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('section[id^="dev-diaries-"]').forEach((section, index) => {
                const heading = section.querySelector(':scope > h2');
                if (!heading) return;

                const trigger = document.createElement('button');
                trigger.type = 'button';
                trigger.className = 'diary-trigger';
                trigger.id = `diary-trigger-${index}`;
                trigger.setAttribute('aria-expanded', 'false');

                const title = document.createElement('span');
                title.textContent = heading.textContent.trim();

                const chevron = document.createElement('span');
                chevron.className = 'diary-chevron';
                chevron.setAttribute('aria-hidden', 'true');
                chevron.textContent = ''; 

                trigger.append(title, chevron);

                const panel = document.createElement('div');
                panel.className = 'diary-panel';
                panel.id = `diary-panel-${index}`;
                panel.setAttribute('role', 'region');
                panel.setAttribute('aria-labelledby', trigger.id);

                const panelInner = document.createElement('div');
                panelInner.className = 'diary-panel-inner';
                const content = document.createElement('div');
                content.className = 'diary-content';

                while (heading.nextSibling) {
                    content.appendChild(heading.nextSibling);
                }

                panelInner.appendChild(content);
                panel.appendChild(panelInner);
                heading.replaceWith(trigger);
                section.append(trigger, panel);
                section.classList.add('diary-accordion');

                trigger.setAttribute('aria-controls', panel.id);

                trigger.addEventListener('click', () => {
                    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
                    trigger.setAttribute('aria-expanded', String(!isOpen));
                    section.classList.toggle('is-open', !isOpen);
                });
            });
        });
})();