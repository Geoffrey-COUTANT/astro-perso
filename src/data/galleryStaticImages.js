import image14 from "../images/image 14.svg";
import image15 from "../images/image 15.svg";
import image16 from "../images/image 16.svg";
import image17 from "../images/image 17.svg";
import image20 from "../images/image 20.svg";
import image21 from "../images/image 21.svg";
import image22 from "../images/image 22.svg";
import image23 from "../images/image 23.svg";
import image24 from "../images/image 24.svg";
import image25 from "../images/image 25.svg";
import image26 from "../images/image 26.svg";
import image27 from "../images/image 27.svg";
import image28 from "../images/image 28.svg";
import image29 from "../images/image 29.svg";
import image30 from "../images/image 30.svg";
import image31 from "../images/image 31.svg";
import image32 from "../images/image 32.svg";
import image33 from "../images/image 33.svg";
import image34 from "../images/image 34.svg";
import image35 from "../images/image 35.svg";
import image36 from "../images/image 36.svg";
import image37 from "../images/image 37.svg";
import image38 from "../images/image 38.svg";
import image39 from "../images/image 39.svg";
import image40 from "../images/image 40.svg";
import image41 from "../images/image 41.svg";
import image42 from "../images/image 42.svg";
import image43 from "../images/image 43.svg";
import image44 from "../images/image 44.svg";
import image45 from "../images/image 45.svg";
import image46 from "../images/image 46.svg";
import image47 from "../images/image 47.svg";

export const allImages = [
    image14, image15, image16, image17, image20, image21, image22, image23, image24, image25,
    image26, image27, image28, image29, image30, image31, image32, image33, image34, image35,
    image36, image37, image38, image39, image40, image41, image42, image43, image44, image45,
    image46, image47
];

export const imageNumbers = [14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

export function getStaticGalleryList() {
    return allImages.map((url, idx) => ({
        id: `static-${idx}`,
        title: `Image ${imageNumbers[idx] ?? idx + 1}`,
        url,
    }));
}
