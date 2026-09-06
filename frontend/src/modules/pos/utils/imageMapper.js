import hamburguesaClasica from "../../../../public/assets/menu/hamburguesa clasica.png";
import chiliBurger from "../../../../public/assets/menu/chili burger.jpeg";
import hawaiBurger from "../../../../public/assets/menu/hawai burger.jpeg";
import hotDogClasico from "../../../../public/assets/menu/hotdog_clasico.png";
import chiliDog from "../../../../public/assets/menu/chili dog.jpeg";
import hotDogHawaiano from "../../../../public/assets/menu/hot dog hawaiano.jpeg";
import sodaImg from "../../../../public/assets/soda.png";
import canadaDryImg from "../../../../public/assets/canada-dry.png";
import duoChiliBurger from "../../../../public/assets/duos/duo_chili_burger_sodas.png";
import duoChiliDog from "../../../../public/assets/duos/duo_chili_dog.png";
import defaultImg from "../../../../public/assets/a244.png";

const IMAGE_OVERRIDE_MAP = {
  "hamburguesa": hamburguesaClasica,
  "hamburguesa doble": hamburguesaClasica,
  "chilli burger": chiliBurger,
  "hawai burger": hawaiBurger,
  "hot dog": hotDogClasico,
  "hot dog de la casa": hotDogClasico,
  "chilli dog": chiliDog,
  "hot dog hawaiano": hotDogHawaiano,
  "coca cola": sodaImg,
  "canada dry": canadaDryImg,
  "soda": sodaImg,
  "duo pack chilli dog": duoChiliDog,
  "duo chili burgers y soda": duoChiliBurger
};

export const getProductImage = (item) => {
  if (!item) return defaultImg;

  const nombre = (item.nombre || item.producto || "").toLowerCase().trim();

  // Estas son las imágenes nuevas que ya utiliza el POS y la página pública.
  if (IMAGE_OVERRIDE_MAP[nombre]) {
    return IMAGE_OVERRIDE_MAP[nombre];
  }

  if (item.imagen && item.imagen.trim() !== "") {
    return item.imagen;
  }
  
  return defaultImg;
};
