import React from "react";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { Input } from "../../Input";
import s from "./ThemeForm.module.scss";

type ThemeFormPropsType = {
  data: string[];
  formName: string;
  handleOnClick?: (i: string) => any;
};

export type ThemeFormValuesType = {};

const FormTheme: React.FC<
  InjectedFormProps<ThemeFormValuesType, ThemeFormPropsType> &
    ThemeFormPropsType
> = ({ data, handleOnClick }) => {
  return (
    <form
      autoComplete="off"
      noValidate
      className={`${data.length === 2 ? s.double : s.third}`}
    >
      {data.map((i) => (
        <div className={s.input} key={i}>
          <Field
            name={i}
            type="checkbox"
            label={i}
            component={Input}
            onClick={() => handleOnClick && handleOnClick(i)}
          />
        </div>
      ))}
    </form>
  );
};

const mapStateToProps = ({}, props: any) => ({ form: props.formName });

export const ThemeForm = connect(mapStateToProps)(
  reduxForm<ThemeFormValuesType, ThemeFormPropsType>({})(FormTheme)
);
