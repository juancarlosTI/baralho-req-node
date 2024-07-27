import { Component } from "react";
import './panel.css'


class Panel extends Component {
    constructor(){
        super()
        this.state = {
            title: 'Título do painel'
        }
    }

    render(){
        return (
            <section className="panel" onClick={() => this.setState({title:'Valor novo do titulo'})}>
                <h2>{this.state.title}</h2>
            </section>
        )
    }
}

export default Panel


// Para alterar uma propriedade do objeto constructor, é necessário a utilização do setState ( método responsável por fazer a alteração na propriedade do objeto). 