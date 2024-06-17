import moment from "moment";
import "moment/dist/locale/fr";

const dateLang = ({ date, format, lang }) => {
  return moment(date).locale(lang).format(format);
};
const format_date = (date, format = "DD MMM YYYY", lang = "fr") =>
  dateLang({ date, format, lang });

export default format_date;
