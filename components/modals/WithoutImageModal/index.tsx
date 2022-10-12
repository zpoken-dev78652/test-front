import React from 'react';
import s from './WithoutImageModal.module.scss';

type WithoutImageModalProps = {
  header: string;
  text: string;
};

export const WithoutImageModal: React.FC<WithoutImageModalProps> = ({ header, text, children }) => {
  return (
    <div className={s.container}>
      <h3 className={s.header}>{header}</h3>
      <p className={s.paragraph}>{text}</p>
      {children}
    </div>
  );
};
