import React,{useEffect,useState} from 'react'
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Button} from "@mui/material";
import {DialogActions, TextField} from "@mui/material";
import axios from "axios";
const NewItem = (props) => {
    const [stateDialog,updateState]=useState(props.openDialog)
    const [name,updateName]=useState('')
    const [info,updateInfo]=useState('')
    useEffect(()=>{
        updateState(props.openDialog)
    },[])
    const handleClose = () => {
        updateState(false)
        props.handleCancelling()
    };

    const addNewList = () => {
        const newItem = {"todoID":props.todoID, "name": name , "info":info};
        axios.post('/todo-new-todo', newItem).then(response =>
        props.newListSent(response.data),
        updateState(false))
    }
    return(
        <Dialog   fullWidth
                 maxWidth='xs' onClose={handleClose} open={stateDialog}>
            <DialogTitle style={{margin:"auto"}}>New TodoList</DialogTitle>
            <TextField style={{margin:"12px"}}
                       onChange={(e)=>updateName(e.target.value)}
                       label="Item Name" placeholder="Item Name"/>
            <TextField style={{margin:"12px"}}
                       onChange={(e)=>updateInfo(e.target.value)}
                       label="Item info" placeholder="Item Description"/>
            <DialogActions>
                <Button onClick={()=>handleClose()}>Cancel</Button>
                <Button disabled={info === '' || name===''} onClick={()=>addNewList()}> Add </Button>
            </DialogActions>
        </Dialog>
    )
}
export default NewItem