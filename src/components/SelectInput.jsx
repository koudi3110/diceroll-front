import React, { MouseEventHandler, useEffect, useState } from "react";
import Select, { components } from "react-select";
import * as _ from "lodash";

const SelectInput = ({
  options = [],
  label = "name",
  trackId = "code",
  order = true,
  rendFlag = false,
  placeholder,
  onChange,
  selectedValue,
  labelImage = 'flag',
  className,
  isClearable = true,
  isDisabled = false,
}) => {
  const { SingleValue, Option } = components;
  // console.log(options);
  const [listItem, setListItem] = useState(options);
  const [search, setSearch] = useState("");

  const SortArray = (x, y) =>
    x[label]
      ?.toString()
      ?.toLowerCase()
      ?.localeCompare(y[label]?.toString()?.toLowerCase());

  const filterOption =
    label !== "district"
      ? [...options].sort(SortArray)
      : _.unionBy([...options].sort(SortArray), "district");

  const [filteredFrom, setFilteredFrom] = useState(filterOption);

  useEffect(() => {
    if (order) {
      if (label == "district")
        setFilteredFrom(_.uniqBy([...options].sort(SortArray), "district"));
      else setFilteredFrom([...options].sort(SortArray));
    } else {
      setListItem([...options]);
      if (label == "district")
        setFilteredFrom(_.uniqBy([...options], "district"));
      else setFilteredFrom([...options]);
    }
  }, [options]);

  const findFilm = (query) => {
    if (query !== "") {
      if (label === "district") {
        setFilteredFrom(
          _.uniqBy(
            [...filterOption].filter((item) =>
              item[label]
                .toString()
                .toLowerCase()
                .includes(query.toString().toLowerCase())
            ),
            "district"
          )
        );
      } else {
        setFilteredFrom(
          [...filterOption].filter((item) =>
            item[label]
              .toString()
              .toLowerCase()
              .includes(query.toString().toLowerCase())
          )
        );
      }
    } else if (query === "") {
      if (label === "district") {
        setFilteredFrom(
          _.uniqBy([...filterOption].sort(SortArray), "district")
        );
      } else {
        setFilteredFrom([...filterOption].sort(SortArray));
      }
    }
  };

  const IconSingleValue = (props) => (
    <SingleValue {...props}>
      {rendFlag && props?.data?.flag && (
        <img
          src={props?.data?.flag}
          style={{
            height: "18px",
            width: "22px",
            borderRadius: "5%",
            marginRight: "10px",
          }}
        />
      )}
      <span className="flex items-center">
        <span className="text-slate-800">
          {props?.data[label] ? `${props?.data[label]}` : placeholder}
        </span>
      </span>
    </SingleValue>
  );

  const IconOption = (props) => (
    <Option {...props}>
      {props.data[labelImage] && (
        <img
          src={props.data[labelImage]}
          style={{
            height: "18px",
            width: "25px",
            borderRadius: "5%",
            marginRight: "10px",
          }}
        />
      )}
      <span className="flex items-center">
        <span className="text-slate-800">
          {props.data[label] && `${props.data[label]}`}{" "}
          {props.data[trackId] && ` (${props.data[trackId]})`}
        </span>
      </span>
    </Option>
  );
  return (
    <div className="App">
      <Select
        components={{ SingleValue: IconSingleValue, Option: IconOption }}
        onChange={(val) => {
          onChange(val);
          setFilteredFrom(filterOption);
        }}
        options={filteredFrom.length >= 1 ? filteredFrom : [1]}
        value={selectedValue}
        placeholder={placeholder}
        isDisabled={isDisabled}
        // classNamePrefix='filter'
        // className=""
        // value={selectedValue}
        isClearable={isClearable}
        // isSearchable
        // name="name"
        styles={{
          singleValue: (provided) => ({
            ...provided,
            flex: 1,
            display: "flex",
            padding: 3,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
          }),
          control: (styles) => ({
            ...styles,
            backgroundColor: "white",
            color: "#000",
            borderColor: "rgb(226, 232, 240)",
          }),
          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            // const color = chroma(data.color);
            return {
              ...styles,
              backgroundColor: isFocused
                ? "#e9ecef"
                : isSelected
                ? "rgba(210, 210, 210,0.6)"
                : undefined,
              flex: 1,
              color: "#000",
              cursor: isDisabled ? "not-allowed" : "progress",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            };
          },
        }}
      />
    </div>
  );
};
export default SelectInput;
