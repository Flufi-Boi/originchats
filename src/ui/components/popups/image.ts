import { closePopup, type Popup } from "../popup";

export const ImagePopup = (url: string): Popup => {
    return {
        generate(parent, data) {
            const container = document.createElement("div");
            container.id = "image-popup";
            setTimeout(() => {
                container.classList.add("open");
            }, 1);

            container.addEventListener("click", () => {
                closePopup();
            });

            data ??= {};
            data.scale ??= 1;

            const img = document.createElement("img");
            img.addEventListener("click", (e) => {
                data.scale += 1;
                if (data.scale > 3)
                    data.scale = 1;

                img.style.transform = `scale(${(data.scale - 1) ** 1.5  + 1})`;

                e.stopImmediatePropagation();
            })
            img.src = url;
            container.appendChild(img);

            parent.appendChild(container);
            return container;
        }
    }
}
