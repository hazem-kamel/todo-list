import React,{useEffect,useState} from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import axios from "axios";
import {Button} from "@mui/material";
import {DialogActions, TextField} from "@mui/material";
const NewTodoList = props => {
    const [stateDialog,updateState]=useState(props.openDialog)
    const [title,updateTitle]=useState('')
    useEffect(()=>{
        updateState(props.openDialog)
    },[])
    const handleClose = () => {
        updateState(false)
        props.handleCancelling()
    };
    const addNewList = () => {
        const newList = { "title": title };
        axios.post('/todo-new-list', newList).then(response =>
            props.newListSent(response.data),
            updateState(false))
    }
    return(
        <Dialog  fullWidth
                 maxWidth='xs'  onClose={handleClose} open={stateDialog}>
            <DialogTitle style={{margin:"auto"}}>New TodoList</DialogTitle>
            <TextField style={{margin:"12px"}}
                       onChange={e=>updateTitle(e.target.value)}
                       label="Todo List Title" placeholder="Type title name"/>
            <DialogActions>
                <Button style={{margin:"12px"}} onClick={()=>handleClose()}>Cancel</Button>
                <Button style={{margin:"12px"}} onClick={()=>addNewList()} disabled={title.length < 3}> Add </Button>
            </DialogActions>
        </Dialog>
    )
}
export default NewTodoList