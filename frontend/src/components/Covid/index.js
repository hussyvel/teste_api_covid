import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class FormCovid extends Component {
  state = {
    model: {
      id: 0,
      state: '',
      cases: 0,
      deaths: 0
    }
  };

  setValues = (e, field) => {
    const { model } = this.state;
    const updatedModel = { ...model, [field]: e.target.value };
    this.setState({ model: updatedModel });
  };

  createOrUpdate = () => {
    const { model } = this.state;
    if (model.id !== 0) {
      // Atualização de um item existente
      this.props.updateCovid(model);
    } else {
      // Criação de um novo item
      this.props.createCovid(model);
    }
    this.setState({ model: { id: 0, state: '', cases: 0, deaths: 0 } });
  };

  componentWillMount() {
    PubSub.subscribe('edit-covid', (topic, covid) => {
      this.setState({ model: covid });
    });
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="state">Estado:</Label>
          <br />
          <Input
            id="state"
            type="text"
            value={this.state.model.state}
            placeholder="nome do estado"
            onChange={(e) => this.setValues(e, 'state')}
          />
        </FormGroup>
        <FormGroup>
          <div className="form-row">
            <div className="col-md-6">
              <Label for="cases">Casos:</Label>
              <Input
                id="cases"
                type="text"
                value={this.state.model.cases}
                placeholder="Quantidade de casos"
                onChange={(e) => this.setValues(e, 'cases')}
              />
            </div>
            <div className="col-md-6">
              <Label for="deaths">Mortes:</Label>
              <Input
                id="deaths"
                type="text"
                value={this.state.model.deaths}
                placeholder="Quantidade de mortes"
                onChange={(e) => this.setValues(e, 'deaths')}
              />
            </div>
          </div>
        </FormGroup>
        <Button
          id="btnGravar"
          color="p-3 mb-2 bg-primary text-white"
          block
          onClick={this.createOrUpdate}
        >
          Gravar
        </Button>
      </Form>
    );
  }
}

class ListCovid extends Component {
  delete = (id) => {
    this.props.deleteCovid(id);
  };

  onEdit = (covid) => {
    PubSub.publish('edit-covid', covid);
  };

  render() {
    const { covids } = this.props;

    return (
      <Table className="table-bordered text-center">
        <thead className="text-white bg-dark">
          <tr>
            <th>Estado</th>
            <th>Casos</th>
            <th>Mortes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {covids.map((covid) => (
            <tr key={covid.id}>
              <td>{covid.state}</td>
              <td>{covid.cases}</td>
              <td>{covid.deaths}</td>
              <td>
                <Button
                  color="info"
                  size="sm"
                  onClick={() => this.onEdit(covid)}
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => this.delete(covid.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default class CovidBox extends Component {
  state = {
    covids: []
  };

  url = 'http://localhost:8080/api';

  componentDidMount() {
    this.fetchCovids();
  }

  fetchCovids = () => {
    fetch(`${this.url}/get_covids`)
      .then((response) => response.json())
      .then((covids) => this.setState({ covids }))
      .catch((e) => console.log(e));
  };

  createCovid = (newCovid) => {
    fetch(`${this.url}/post_covids`, {
      method: 'POST',
      body: JSON.stringify(newCovid),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((createdCovid) => {
        const updatedCovids = [...this.state.covids, createdCovid];
        this.setState({ covids: updatedCovids });
      })
      .catch((e) => console.log(e));
  };

  
  deleteCovid = (id) => {
    fetch(`${this.url}/delete_covid/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          const covids = this.state.covids.filter((covid) => covid.id !== id);
          this.setState({ covids });
        } else {
          console.log('Erro ao excluir o item.');
        }
      })
      .catch((error) => console.log(error));
  };
  

  updateCovid = (updatedCovid) => {
    fetch(`${this.url}/update_covid/${updatedCovid.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedCovid),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then(() => {
        const updatedCovids = this.state.covids.map((covid) => {
          if (covid.id === updatedCovid.id) {
            return { ...covid, ...updatedCovid };
          }
          return covid;
        });
        this.setState({ covids: updatedCovids });
      })
      .catch((e) => console.log(e));
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 my-3">
          <h2 className="font-weight-bold text-center">Cadastro de Estados no Benchmarks</h2>
          <FormCovid createCovid={this.createCovid} updateCovid={this.updateCovid} />
        </div>
        <div className="col-md-6 my-3">
          <h2 className="font-weight-bold text-center">Lista de Estados no Benchmarks</h2>
          <ListCovid covids={this.state.covids} deleteCovid={this.deleteCovid} />
        </div>
      </div>
    );
  }
}
