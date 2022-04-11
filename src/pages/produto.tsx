import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useParams, useSearchParams } from 'react-router-dom';
import './styles.css';
import Modal from 'react-modal';
import Api from "../config/api";

Modal.setAppElement('#root');

interface IState {
    token: string;
    produto : []
}

interface IProduto {
    descricao: string;
    pesoBruto: number;
    pesoLiquido: number;
    grupo: string;
    codigoCliente: string;
    saldo: number;
    um: string;
    codigo: string;
}

interface CProduto {
    codigoCliente: string;
    descricao: string;
    pesoBruto: number;
    pesoLiquido: number;
    grupo: string;
    um: string;
}


export default function Produto() { 

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsEditOpen, setIsEditOpen] = useState(false);
    function handerOpenCadastroModal(){
        setIsOpen(true);
    }
    function handlerCloseCadastroModal(){
        setIsOpen(false);
    }
    function handerOpenEditModal(produto: IProduto){
        setCodigoCliente(produto.codigoCliente);
        setDescricao(produto.descricao);
        setGrupo(produto.grupo);
        setUm(produto.um);
        setPesoBruto(produto.pesoBruto);
        setPesoLiquido(produto.pesoLiquido);
        setCodigo(produto.codigo);
        setIsEditOpen(true);
    }
    function handlerCloseEditModal(){
        setIsEditOpen(false);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto'
        }
    }
    const [produto, setProduto] = useState([]);
    const [offset, setOffset]  = useState(0);
    const [limit, setLimit] = useState(5);
    const location = useLocation();
    const [listGrupo, setListGrupo] = useState([])
    const [listUM, setListUM] = useState([])
    const state = location.state as IState;

    const [codigoCliente, setCodigoCliente] = useState("");
    const [codigo, setCodigo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [pesoBruto, setPesoBruto] = useState(0);
    const [pesoLiquido, setPesoLiquido] = useState(0);
    const [grupo, setGrupo] = useState("");
    const [um, setUm] = useState("");
    const listarProduto = useCallback(async () => {
       const response = await Api.get(`/treinamento/produto?offset=${offset}&limit=${limit}`, {headers: {"Authorization": "Bearer " + state.token}})
        setProduto(response.data.list);
        setLimit(response.data.limit);
        setOffset(response.data.offset);
    },[produto])

    const getGrupo = useCallback(async () => {
        const response = await Api.get(`/treinamento/produto/grupo`, {headers: {"Authorization": "Bearer " + state.token}})
         setListGrupo(response.data.list)
     },[])

     const getUM = useCallback(async () => {
        const response = await Api.get(`/treinamento/produto/um`, {headers: {"Authorization": "Bearer " + state.token}})
        setListUM(response.data.list)
     },[])

    useEffect(() => {
        (async () => {
            await listarProduto()
         })()
    }, [limit, offset])

    useEffect(() => {
        (async () => {
            await getGrupo()
            await getUM()
         })()
    }, [])

    const listarGrupo = useCallback(async() => {
        const response = await Api.get(`/treinamento/produto/grupo`, {headers: {"Authorization": "Bearer " + state.token}})
        console.log(response.data)
    },[])
    useEffect(() => {
        (async () => {
            await listarGrupo()
         })()
    }, [])


    async function apagar (codigo){
         const response = await Api.delete(`/treinamento/produto?codigo=${codigo}`, {headers: {"Authorization": "Bearer " + state.token}})
         console.log(response)
         listarProduto;
    }

    async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
      //  const dados = {
        //    codigoCliente,
        //    descricao,
         //   pesoBruto,
         //   pesoLiquido,
         //   grupo,
         //   um
      //  }
        
        const response = await Api.post(`/treinamento/produto`, {codigoCliente, descricao, pesoBruto, pesoLiquido, grupo, um}, {headers: {"Authorization": "Bearer " + state.token, tenantId: "01,103"}})

        console.log(response)
    }

    async function editar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
      //  const dados = {
        //    codigoCliente,
        //    descricao,
         //   pesoBruto,
         //   pesoLiquido,
         //   grupo,
         //   um
      //  }
        
        const response = await Api.put(`/treinamento/produto`, {codigo, descricao, pesoBruto, pesoLiquido, um}, {headers: {"Authorization": "Bearer " + state.token, tenantId: "01,103"}})

        console.log(response)
    }

    

    const ListarProdutoTabelo = () => {
        return (
            <>
                {produto.map((p: IProduto, index) =>(
                    <tr key={index}>
                        <td className="tableTh">{p.descricao}</td>
                        <td className="textTh">{p.pesoBruto} </td>
                        <td className="textTh">{p.pesoLiquido}</td>
                        <td className="textTh">{p.grupo}</td>
                        <td className="textTh">{p.um}</td> 
                        <td className="textTh">{p.saldo}</td>
                        <td className="textTh">{p.codigoCliente}</td>
                        <td className="textTh">{p.codigo}</td> 
                        <td> <button className="btn-editar" onClick={() => handerOpenEditModal(p)}>Editar</button> 
                        <button onClick={() => apagar(p.codigo)} className="btn-excluir">Excluir</button> 
                        </td>
                    </tr>
                ))}
            </>
        )
    }
    return (
    <>
    <div className="container">
            <div className="table-header">
                <div className="login-table-title">
                    <span className="textTitle">Lista De Produtos Cadastrados</span>
                </div>
            </div>
            <div>
                <button className="btn-add" onClick={handerOpenCadastroModal}>ADD +</button>
            </div>
        <div className="container-login">
            <div className="wrap-table">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Descrição:</th>
                        <th>Peso Bruto:</th>
                        <th>Peso Liquido:</th>
                        <th>Grupo:</th>
                        <th>UM:</th>
                        <th>Saldo:</th>
                        <th>Codigo Cliente:</th>
                        <th>Codigo:</th> 
                        <th>Opções:</th>
                    </tr>
                    </thead>
                    <tbody>
                        <ListarProdutoTabelo />
                    </tbody>
                </table>
                <button onClick={()  => setOffset (prev => prev +  1)}>Proximo</button>
                <button onClick={() => offset > 0 ? setOffset(prev => prev-1) : null}>Anterior </button>
            </div>
        </div>
    </div>
    
    <Modal isOpen={modalIsOpen} onRequestClose={handlerCloseCadastroModal}>
        <div>
            <div className="titleModal">
            <h1 className="modal-title" >Cadastrar Novo Produto</h1>
            </div>
            <div className="container-login modalTest">
            <div className="wrap-login">
                <form  className="login-form" onSubmit={e => cadastrar(e)} >
                    <div className="wrap-input ">
                    <input className="input "  onChange={e => setCodigoCliente(e.target.value)}  name="codigoCliente" id="codigoCliente"  type="text" required />
                    <span className="focus-input" data-placeholder="Codigo Do Cliente"></span>
                    </div>
                    <div className="wrap-input ">
                    <input className="input "  onChange={e => setDescricao(e.target.value)}  name="descricao" id="descricao" type="text" required />
                    <span className="focus-input" data-placeholder="Descrição Do Produto"></span>
                    </div>
                    <div className="wrap-input ">
                    <input className="input "  onChange={e => setPesoBruto(Number(e.target.value))} name="pesoBruto" id="pesoBruto" type="number" required />
                    <span className="focus-input" data-placeholder="Peso Bruto"></span>
                    </div>
                    <div className="wrap-input">
                    <input className="input "  onChange={e => setPesoLiquido(Number(e.target.value))} name="pesoLiquido" id="pesoLiquido" type="number" required />
                    <span className="focus-input" data-placeholder="Peso Liquido"></span>
                    </div>
                    <div className="wrap-input">
                    <p className="option"   data-placeholder="grupo">Grupo</p>
                    <select onChange={e => setGrupo(e.target.value)} required>
                        {listGrupo && listGrupo.map((gp, index) => (
                            <option value={gp} key={index}>{gp}</option>
                        ))}
                    </select>
                    </div>
                    <div className="wrap-input">
                    <p className="option"   data-placeholder="um">Grupo</p>
                    <select onChange={e => setUm(e.target.value)} required>
                    {listUM && listUM.map((unid, index) => (
                            <option value={unid} key={index}>{unid}</option>
                        ))}
                    </select>
                    </div>
                    <div className="container-login-form-btn">
                    <button className="login-form-btn button" type="submit">Cadastrar</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </Modal>

        <Modal isOpen={modalIsEditOpen} onRequestClose={handlerCloseEditModal}>
        <div>
            <div className="titleModal">
            <h1 className="modal-title" >Editar Produto</h1>
            </div>
            <div className="container-login modalTest">
            <div className="wrap-login">
                <form  className="login-form" onSubmit={e => editar(e)} >
                    <div className="wrap-input ">
                    <input className="input " onChange={e => setCodigo(e.target.value)} value={codigo} name="codigo" id="codigo"  type="text" required />
                    <span className="focus-input" data-placeholder="Codigo"></span>
                    </div>
                    <div className="wrap-input ">
                    <input className="input " onChange={e => setDescricao(e.target.value)} value={descricao} name="descricao" id="descricao" type="text" required />
                    <span className="focus-input" data-placeholder="Descrição Do Produto"></span>
                    </div>
                    <div className="wrap-input ">
                    <input className="input "  onChange={e => setPesoBruto(Number(e.target.value))} value={pesoBruto}  name="pesoBruto" id="pesoBruto" type="number" required />
                    <span className="focus-input" data-placeholder="Peso Bruto"></span>
                    </div>
                    <div className="wrap-input">
                    <input className="input "  onChange={e => setPesoLiquido(Number(e.target.value))} value={pesoLiquido} name="pesoLiquido" id="pesoLiquido" type="number" required />
                    <span className="focus-input" data-placeholder="Peso Liquido"></span>
                    </div>
                    <div className="wrap-input">
                    <p className="option"   data-placeholder="grupo">Grupo</p>
                    <select onChange={e => setGrupo(e.target.value)} value={grupo} required>
                        {listGrupo && listGrupo.map((gp, index) => (
                            <option value={gp} key={index}>{gp}</option>
                        ))}
                    </select>
                    </div>
                    <div className="wrap-input">
                    <p className="option"   data-placeholder="um">Grupo</p>
                    <select onChange={e => setUm(e.target.value)} value={um} required>
                    {listUM && listUM.map((unid, index) => (
                            <option value={unid} key={index}>{unid}</option>
                        ))}
                    </select>
                    </div>
                    <div className="container-login-form-btn">
                    <button className="login-form-btn button" type="submit">Cadastrar</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </Modal>
    </>
    )
}