import React from "react";
import { PropTypes } from "prop-types";
import { NumericFormat } from "react-number-format";

const NumberForm = ({
  value,
  suffix,
  className = "text-center",
  language,
  textSuffix,
  textPrefix,
  isBack = true,
}) => {
  // console.log((value).toString());
  return (
    <NumericFormat
      value={value.toString()}
      type="text"
      displayType="text"
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      isNumericString
      // thousandSeparator={language?.lang !== "fr"}
      renderText={(val) => (
        <span>
          {textPrefix}
          {val} {textSuffix}
        </span>
      )}
      suffix={isBack ? " " + suffix : ""}
      prefix={isBack ? "" : " " + suffix}
    />
  );
};

NumberForm.propTypes = {
  suffix: PropTypes.string,
  textSuffix: PropTypes.string,
  textPrefix: PropTypes.string,
  // value: PropTypes.string || PropTypes.number,
  style: PropTypes.shape({}),
  language: PropTypes.shape({}),
};

NumberForm.defaultProps = {
  suffix: "",
  textSuffix: "",
  textPrefix: "",
  value: "0",
  style: {},
  language: { name: "francais", lang: "fr", id: 1 },
};

export default NumberForm;
