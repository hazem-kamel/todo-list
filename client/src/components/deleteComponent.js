import React, {useEffect, useState} from 'react'
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button, DialogActions, TextField} from "@mui/material";
import {Error} from "@mui/icons-material";
import axios from "axios";
const DeleteComponent = (props) =>{
            const handleDeleteItem=()=>{
                const deletedItem = {"todoID":props.todoID, "listID": props.listID};
                axios.post('/todo-item-delete', deletedItem).then(response =>  props.newListSent(response.data),
                    updateState(false));
    }
    const handleDeleteList=()=>{
        const deletedItem = { "listID": props.listID};
        axios.post('/todo-delete', deletedItem).then(response =>
                props.newListSent(response.data),
            updateState(false)
        );
    }
    const [stateDialog,updateState]=useState(props.openDialog)
    useEffect(()=>{
        updateState(props.openDialog)
    },[])
    const handleClose = () => {
        updateState(false)
        props.newListSent(undefined)

    };
    return(
        <Dialog  fullWidth
                maxWidth='xs'  onClose={handleClose} open={stateDialog}>
            <DialogTitle  style={{margin:"auto"}}><Error style={{fontSize: "46px",
                color:"#d32f2f"}}/></DialogTitle>
            <h4  style={{color:"#d32f2f",margin:"auto"}}>Are you sure you want to delete this item ?</h4>
            <DialogActions style={{margin:"12px"}}>
                <Button onClick={()=>handleClose()} color="primary">Cancel</Button>
                <Button onClick={()=>props.deletingInfo==='deleteItem' ? handleDeleteItem() : handleDeleteList()} color="error"> Delete </Button>
            </DialogActions>
        </Dialog>
    )
}
export default DeleteComponent