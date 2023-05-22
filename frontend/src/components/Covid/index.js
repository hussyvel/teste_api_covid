import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import { 
        Table,
        Button,
        Form,
        FormGroup,
        Label,
        Input
    } from 'reactstrap';
    
class FormCovid extends Component {

    state = {
        model: {
            id: 0,
            state:'',
            cases: 0,
            deaths: 0
        }
    };

    setValues = (e, field) => {
        const { model } = this.state;
        model[field] = e.target.value;
        this.setState({ model }); 
        
    }


    create = () => {
       
        this.setState({ model: { id: 0, state:'', cases: 0, deaths: 0 }})
        this.props.covidCreate(this.state.model)

    }

    componentWillMount(){
        PubSub.subscribe('edit-covid', (topic, covid) => {
            this.setState({ model: covid });
        });
    }

    render(){
        return(
            <Form>
                <FormGroup>
                    <Label for="state" >Estado:</Label><br></br>
                    <Input id='state' type='text' value={this.state.model.state} placeholder='nome do estado'
                    onChange={e => this.setValues(e, 'state')}/>
                </FormGroup>
                <FormGroup>
                    <div className='form-row'>
                        <div className='col-md-6'>
                            <Label for='cases'>Casos:</Label>
                            <Input id='cases' type='text' value={this.state.model.cases} placeholder='Quantidade de casos'
                            onChange={e => this.setValues(e, 'cases')}/>
                        </div>
                        <div className='col-md-6'>
                            <Label for='deaths'>Mortes:</Label>
                            <Input id='deaths' type='text' value={this.state.model.deaths} placeholder='Quantidade de mortes'
                            onChange={e => this.setValues(e, 'deaths')}/>
                        </div>
                    </div>
                </FormGroup>
                <Button color="p-3 mb-2 bg-primary text-white" block onClick={this.create}>Gravar</Button>
            </Form>
        );
    }
}

class ListCovid extends Component {
 
    delete = (id) => {
        this.props.deleteCovid(id);
    } 

    onEdit = (covid) => {
        PubSub.publish('edit-covid', covid);
    }

    render(){
        const { covids } = this.props;
        
        return(
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
                    {
                        covids.map(covid => (
                            <tr key={covid.id}>
                                <td>{covid.state}</td>
                                <td>{covid.cases}</td>
                                <td>{covid.deaths}</td>
                                <td>
                                    <Button color="info" size="sm" onClick={e => this.onEdit(covid)}>Edit</Button>
                                    <Button color="danger" size="sm" onClick={e => this.delete(covid.id)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        );
    }
}


export default class CovidBox extends Component {
    
    Url = 'http://localhost:8080/api';

    state = {
        covids:[],   
    }

    componentDidMount(){
        fetch(this.Url)
        .then(response => response.json())
        .then(covids => this.setState({covids}))
        .catch(e => console.log(e));
    }

    create = (post_covid) => {
        let data = {
            id: parseInt(post_covid.id),
            state: post_covid.state,
            cases:parseInt(post_covid.cases),
            deaths:parseInt(post_covid.deaths)
        };

        console.log(data);
        
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-type':'application/json'
            })
        };
        fetch(`${this.Url}/post_covids`, requestInfo)
        .then(response => response.json())
        .then(newCovid =>  { 
            let { covids } = this.state;
            covids.push(newCovid);
            this.setState({covids})
        })
        .catch(e => console.log(e)); 
    }

    delete = (id) => {
        fetch(`${this.Url}/delete_covid/${id}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(rows => {
            const covids = this.state.covids.filter(covid => covid.id !== id);
            this.setState({ covids })
        })
        .catch(e => console.log(e))
 
    }

    render() {
        return(
            <div className="row">
                <div className="col-md-6 my-3">
                    <h2 className='font-weight-bold text-center'>Cadastro de Estados no Benchmarks</h2>
                    <FormCovid covidCreate ={this.create} />
                </div>
                <div className="col-md-6 my-3">
                    <h2 className='font-weight-bold text-center'>Lista de Estados no Benchmarks</h2>
                    <ListCovid covids={this.state.covids} deleteCovid={this.delete}/>
                </div>
            </div>
        )
    }

}


