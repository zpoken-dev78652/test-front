/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useMediaQuery } from "../../hooks";
import { mobileWidth } from "../../constants";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

type SliderTrops = {
  slides: {
    banner: string;
    banner_mobile: string;
    id: string;
    is_visible: boolean;
    link: string;
  }[];
};

export const Carousel: React.FC<SliderTrops> = ({ slides }) => {
  const isMobile: boolean = useMediaQuery(`(max-width: ${mobileWidth}px)`);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    pauseOnDotsHover: false,
    pauseOnFocus: false,
    pauseOnHover: false,
    swipe: false,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "custom-slider",
    dotsClass: "custom-slider__dots",
    customPaging: () => <div className="custom-slider__dot" />,
  };

  return (
    <Slider {...settings}>
      {slides &&
        slides.map((slide, idx) => (
          <Link href={slide?.link || ""} key={idx}>
            <a>
              <img
                src={isMobile ? slide?.banner_mobile : slide?.banner}
                alt="slide"
              />
            </a>
          </Link>
        ))}
    </Slider>
  );
};
