import React from "react";
import "./style.scss";

class PinInput extends React.Component {
  state = {
    value1: "",
    value2: "",
    value3: "",
    value4: "",
  };

  val1 = React.createRef();
  val2 = React.createRef();
  val3 = React.createRef();
  val4 = React.createRef();

  componentDidUpdate(prevProps) {
    if (prevProps.onSuccess !== this.props.onSuccess && this.props.onSuccess) {
      this.setState({
        value1: "",
        value2: "",
        value3: "",
        value4: "",
      });
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (!isNaN(event.target.value) === true) {
      this.setState({ [name]: value }, () => {
        const { value1, value2, value3, value4 } = this.state;
        this.props.onChange({ value1, value2, value3, value4 });
      });
      if (name === "value1" && value !== "") {
        this.val2.current.focus();
      }
      if (name === "value2" && value !== "") {
        this.val3.current.focus();
      }
      if (name === "value3" && value !== "") {
        this.val4.current.focus();
      }
      if (name === "value4" && value === "") {
        this.val3.current.focus();
      }
      if (name === "value3" && value === "") {
        this.val2.current.focus();
      }
      if (name === "value2" && value === "") {
        this.val1.current.focus();
      }
    }
  };

  render() {
    const { error } = this.props;
    const { value1, value2, value3, value4 } = this.state;
    return (
      <form
        ref={this.props.innerRef}
        className={`pin-input d-flex justify-content-center`}
      >
        <input
          ref={this.val1}
          className={`mr-3 ${error && "error"} pin-value`}
          type="password"
          maxLength="1"
          value={value1}
          name="value1"
          onChange={this.handleChange}
        />
        <input
          ref={this.val2}
          className={`mr-3 ml-0 ${error && "error"} pin-value`}
          type="password"
          maxLength="1"
          value={value2}
          name="value2"
          onChange={this.handleChange}
        />
        <input
          ref={this.val3}
          className={`mr-3 ml-0 ${error && "error"} pin-value`}
          type="password"
          maxLength="1"
          value={value3}
          name="value3"
          onChange={this.handleChange}
        />
        <input
          ref={this.val4}
          className={`${error && "error"} pin-value`}
          type="password"
          maxLength="1"
          value={value4}
          name="value4"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <PinInput innerRef={ref} {...props} />
));
