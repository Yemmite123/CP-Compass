import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import { getTickets, createNewTicket, searchTickets } from '#/store/support/actions'
import Modal from '#/components/Modal';
import DataTable from '#/components/DataTable';
import DragDropFileInput from '#/components/DragDropFileInput';
import Pagination from '#/components/Pagination';
import { validateFields, serializeErrors } from '#/utils'
import { columns } from './utils';
import './style.scss';

class Tickets extends React.Component {

  state = {
    search: '',
    showNewModal: false,
    title: '',
    issue: '',
    errors: null,
    files: null,
    limit: 10,
    pageNumber: 1,
  }
  imgRef = React.createRef();

  componentDidMount() {
    this.props.getTickets(10, 1);
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value });

    if(name === 'search' && value === '') {
      return this.props.getTickets(10, 1);
    }
  }

  handleFile = file => {
    this.setState({ files: file });
  }

  handleSubmitSearch = (event) => {
    event.preventDefault();
    const { search } = this.state;
    this.props.searchTickets({ search });
  }

  toggleNewModal = () => {
    this.setState(prevState => ({ showNewModal : !prevState.showNewModal }));
    if(this.state.showNewModal) {
      return this.setState({ title: '', fileNames: [], files: [], issue: '', errors: null })
    }
  }

  submitNewTicket = (event) => {
    event.preventDefault();
    this.setState({ errors: null });
    const { createNewTicket } = this.props;
    const { title, issue, files } = this.state;

    const data = this.state;
    const required = [ 'title', 'issue'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    const formData = new FormData();
    // const fileToUpload = files && files.length > 1 ? files : files

    //create a method that checks the files size and appends the right key to it
    if(files) {
      for(var x = 0; x < files.length; x++) {
      formData.append(files.length > 1 ? 'attachment' : 'attachment[]', files[x])
      }
    }

    formData.append('title', title);
    formData.append('description', issue);

    createNewTicket(formData)
      .then(data => {
        this.toggleNewModal();
        return this.props.getTickets(10, 1);
      });
  }

  naviagetToTicket = (id) => {
    this.props.history.push({
      pathname: `/app/support/ticket/${id}`,
      state: { routeName: 'Support' },
    })
  }

  render() {
    const { search, showNewModal, title, issue, errors } = this.state;
    const { tickets, newLoading, metadata, loading, error } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="tickets-page">
        {showNewModal &&
          <Modal onClose={this.toggleNewModal}>
            <div className="row">
              <div className="col-md-2">
                <p className="cursor-pointer" onClick={this.toggleNewModal}>{'< Back'}</p>
              </div>
              <div className="col-md-8 text-center">
                <p className="text-deep-blue">Create New Ticket</p>
              </div>
            </div>
            <form className="mt-2" onSubmit={this.submitNewTicket}>
              <div className="row align-items-center">
                <div className="col-md-3">
                  <label className="text-grey mb-0">Title of Ticket</label>
                </div>
                <div className="col-md-9">
                  <input
                    name="title"
                    value={title}
                    onChange={this.handleChange}
                    className="form-control"
                  />
                  <p className="text-error mt-0 mb-0">{errors ? errors.title : (errorObject && errorObject['title'])}</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-3">
                  <label className="text-grey mb-0">Describe your issue</label>
                </div>
                <div className="col-md-9">
                  <textarea
                    name="issue"
                    value={issue}
                    onChange={this.handleChange}
                    className="form-control"
                    placeholder="compose your message"
                    rows={6}
                  />
                  <p className="text-error mt-0 mb-0">{errors ? errors.issue : (errorObject && errorObject['description'])}</p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-3">
                  <label className="text-grey mb-0">Attach file</label>
                </div>
                <div className="col-md-9">
                  <DragDropFileInput 
                    handleFile={this.handleFile}  
                    error={errors ? errors.file : (errorObject && errorObject['attachment.0'])} 
                  />
                  <p className="text-error mt-0 mb-0">{errors ? errors.file : (errorObject && errorObject['attachment.0'])}</p>
                  {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}
                </div>
              </div>
              <div className="text-right mt-3">
                <button className="btn btn-sm btn-primary">
                  Submit
                  {newLoading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </form>
          </Modal>
        }
        <div className="d-flex justify-content-end mt-2 flex-wrap">
          <button className="btn btn-sm btn-primary mr-2 mb-3" onClick={this.toggleNewModal}>
            Create new ticket
          </button>
            <form onSubmit={this.handleSubmitSearch}>
              <input
                name="search"
                type="text"
                placeholder="&#128269; Search tickets"
                className="p-2 border-grey border-radius-default mb-3"
                value={search}
                onChange={this.handleChange}
              />
            </form>
        </div>
        <div className="mt-2 card">
        {loading &&
            <div className="text-center p-4">
              <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
            </div>
          }
        {tickets && tickets.length > 0 ?
            <>
              <Pagination
                totalPages={metadata.lastPage}
                page={metadata.page}
                limit={metadata.perPage}
                changePageHandler={(limit, page) => this.props.getTickets(limit, page)}
              />
              <div className="table-class">
              <DataTable
                data={tickets}
                columns={columns}
                info={metadata}
                selectItem={this.naviagetToTicket}
              />
              </div>
            </>
          :
          (!loading &&
          <div className="p-5 text-center">
            <img src={require('#/assets/icons/receipt.svg')} alt="no-tickets" className="img-fluid" />
            <p className="font-light text-grey">{search !== ''.trim() ? 'No ticket history matches this search' : 'You have no booked tickets'}</p>
          </div>)
        }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { support: { tickets, error, metadata } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_TICKETS_REQUEST),
    newLoading: getActionLoadingState(state, actionTypes.CREATE_NEW_TICKET_REQUEST),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tickets));
