import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import {
  getTickets,
  createNewTicket,
  searchTickets,
} from "#/store/support/actions";
import Modal from "#/components/Modal";
import DataTable from "#/components/DataTable";
import DragDropFileInput from "#/components/DragDropFileInput";
import Pagination from "#/components/Pagination";
import Textbox from "#/components/Textbox";
import OffCanvas from "#/components/OffCanvas";
import {
  validateFields,
  serializeErrors,
  openOffCanvas,
  closeOffCanvas,
} from "#/utils";
import { columns } from "./utils";
import "./style.scss";

class Tickets extends React.Component {
  state = {
    search: "",
    showNewModal: false,
    title: "",
    issue: "",
    errors: null,
    files: null,
    limit: 10,
    pageNumber: 1,
  };
  imgRef = React.createRef();

  componentDidMount() {
    this.props.getTickets(10, 1);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    if (name === "search" && value === "") {
      return this.props.getTickets(10, 1);
    }
  };

  handleFile = (file) => {
    this.setState({ files: file });
  };

  handleSubmitSearch = (event) => {
    event.preventDefault();
    const { search } = this.state;
    this.props.searchTickets({ search });
  };

  toggleNewModal = () => {
    this.setState((prevState) => ({ showNewModal: !prevState.showNewModal }));
    openOffCanvas("ticket-offcanvas");
    if (this.state.showNewModal) {
      return this.setState({
        title: "",
        fileNames: [],
        files: [],
        issue: "",
        errors: null,
      });
    }
  };

  resetFields = () => {
    this.setState({
      title: "",
      fileNames: [],
      files: [],
      issue: "",
      errors: null,
    });
  };

  submitNewTicket = (event) => {
    event.preventDefault();
    this.setState({ errors: null });
    const { createNewTicket } = this.props;
    const { title, issue, files } = this.state;

    const data = this.state;
    const required = ["title", "issue"];
    const errors = validateFields(data, required);
    console.log(errors);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    const formData = new FormData();
    // const fileToUpload = files && files.length > 1 ? files : files

    //create a method that checks the files size and appends the right key to it
    if (files) {
      for (var x = 0; x < files.length; x++) {
        formData.append(
          files.length > 1 ? "attachment" : "attachment[]",
          files[x]
        );
      }
    }

    formData.append("title", title);
    formData.append("description", issue);

    createNewTicket(formData).then((data) => {
      this.toggleNewModal();
      this.resetFields();
      closeOffCanvas("ticket-offcanvas");
      return this.props.getTickets(10, 1);
    });
  };

  naviagetToTicket = (id) => {
    this.props.history.push({
      pathname: `/app/support/ticket/${id}`,
      state: { routeName: "Support" },
    });
  };

  render() {
    const { search, showNewModal, title, issue, errors } = this.state;
    const { tickets, newLoading, metadata, loading, error } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="tickets-page">
        <OffCanvas
          title=""
          position="end"
          id="ticket-offcanvas"
          onClose={this.resetFields}
        >
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h3 className="font-bolder text-blue">Create Ticket</h3>
              <p>Describe an Issue you need support with</p>
            </div>

            <div className="mt-3">
              <p>Name of Ticket</p>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Title"
                placeholder="Title"
                name="title"
                value={title}
                error={
                  errors ? errors.title : errorObject && errorObject["title"]
                }
              />
            </div>

            <div className="mt-3">
              <p>Describe your issue</p>
              <div className="">
                <textarea
                  onChange={this.handleChange}
                  rows={5}
                  name="issue"
                  value={issue}
                  placeholder="Compose a message..."
                  className="p-2 w-100 border-faint border-radius-default"
                />
                {errors?.issue ? (
                  <p style={{ color: "#d34242" }}>{errors.issue}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="mt-3">
              <p>Attach Supporting Evidence</p>
              <DragDropFileInput
                handleFile={this.handleFile}
                error={
                  errors
                    ? errors.file
                    : errorObject && errorObject["attachment.0"]
                }
              />
              <p className="text-error mt-0 mb-0">
                {errors
                  ? errors.file
                  : errorObject && errorObject["attachment.0"]}
              </p>
              {error && typeof error === "string" && (
                <p className="text-error mt-2">{error}</p>
              )}
              <p>Upload PDF, JPG or PNG files - Max size of 5MB.</p>
            </div>
            <div className="mt-5 d-flex flex-column flex-grow-1">
              <div className="w-100">
                <button
                  className="btn w-100 btn-sm btn-primary btn-md-block"
                  onClick={this.submitNewTicket}
                >
                  Add ticket
                </button>
              </div>
            </div>
          </div>
        </OffCanvas>
        <div className="d-flex justify-content-end mt-2 flex-wrap text-white stroke-white">
          <button
            className="btn btn-sm btn-primary mr-2 mb-3"
            onClick={this.toggleNewModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              class="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>{" "}
            Create ticket
          </button>
        </div>
        <div className="text-right mt-2">
          {tickets && tickets.length > 0 ? (
            <form onSubmit={this.handleSubmitSearch}>
              <div className="position-relative d-inline">
                <div className="d-inline search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>
                <input
                  name="search"
                  type="text"
                  placeholder="Search Users by Name, Email or Date"
                  className="border-0 text-blue pl-4 p-2 col-lg-5 bg-light border-radius-default mb-3"
                  value={search}
                  onChange={this.handleChange}
                  style={{ fontSize: 14 }}
                />
              </div>
            </form>
          ) : (
            <></>
          )}
        </div>

        <div
          className={`mt-2 card ${
            !(tickets && tickets.length > 0) ? "empty" : ""
          }`}
        >
          {loading && (
            <div className="text-center p-4">
              <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
            </div>
          )}
          {tickets && tickets.length > 0 ? (
            <>
              <div className="table-class">
                <DataTable
                  data={tickets}
                  columns={columns}
                  info={metadata}
                  selectItem={this.naviagetToTicket}
                />
              </div>
              <Pagination
                totalPages={metadata.lastPage}
                page={metadata.page}
                limit={metadata.perPage}
                changePageHandler={(limit, page) =>
                  this.props.getTickets(limit, page)
                }
              />
            </>
          ) : (
            !loading && (
              <div className="p-5 text-center">
                <img
                  src={require("#/assets/icons/receipt.svg")}
                  alt="no-tickets"
                  className="img-fluid"
                />
                <p className="" style={{ color: "rgba(229, 229, 229, 1)" }}>
                  {search !== "".trim()
                    ? "No ticket history matches this search"
                    : "You have no tickets yet"}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      support: { tickets, error, metadata },
    },
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_TICKETS_REQUEST),
    newLoading: getActionLoadingState(
      state,
      actionTypes.CREATE_NEW_TICKET_REQUEST
    ),
    tickets,
    error,
    metadata,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTickets: (limit, pageNumber) => dispatch(getTickets(limit, pageNumber)),
    createNewTicket: (payload) => dispatch(createNewTicket(payload)),
    searchTickets: (payload) => dispatch(searchTickets(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Tickets)
);
