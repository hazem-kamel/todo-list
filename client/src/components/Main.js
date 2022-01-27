import React,{useState,useEffect} from 'react';
import {Button, Card, ListItem} from "@mui/material";
import {Grid} from "@mui/material";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import {Tooltip} from "@mui/material";
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {AddBox} from "@mui/icons-material";
import {Delete} from "@mui/icons-material";
import {CheckCircle} from "@mui/icons-material";
import {CheckBoxSharp} from "@mui/icons-material";
import {Divider} from "@mui/material";
import {Info} from "@mui/icons-material";
import {Close} from "@mui/icons-material";
import axios from "axios";
import NewTodoList from "./NewTodoList";
import NewItem from "./NewItem";
import DeleteComponent from "./deleteComponent";
import './Main.css'
const Main = () => {
const [openNewTodo,updateOpenNewTodo]=useState(false)
const [openNewItem,updateOpenNewItem]=useState(false)
const [deleteItem,updateDeleteItem]=useState(false)
const [deleteList,updateDeleteList]=useState(false)
const [selectedItem,updateSelectedItem]=useState(null)
const [selectedList,updateSelectedList]=useState(null)
const [todoLists,updateTodoLists]=useState([])

useEffect(()=>{
   axios.get('/todo-list').then(res=>{
       updateTodoLists(res.data.lists)
   })
},[])
const handleNewDataSaved = (Data) => {
    if(Data){
        updateTodoLists(Data.lists);
    }
    updateOpenNewTodo(false)
    updateOpenNewItem(false)
    updateDeleteItem(false)
    updateDeleteList(false)
}
const changeStatus=(todo,status,list)=>{
    let statusItem=status
    statusItem === 'notFinished' ? statusItem = 'Finished' : statusItem ='notFinished'
    const itemModified = {"todoID":todo, "status":statusItem,list:list};
    axios.post('/todo-status', itemModified).then(response => updateTodoLists(response.data.lists)
    );

}
const handleCancelling = () => {
    updateOpenNewTodo(false)
    updateOpenNewItem(false)
    updateDeleteItem(false)
    updateDeleteList(false)
}
return(
    <Card className="mainCard" style={{margin:"12px"}}>
        <h3>Todo Lists</h3>
        <Button  onClick={()=>updateOpenNewTodo(true)} variant="contained" style={{margin:"12px"}}
                 color="secondary">Add New TodoList</Button>
        {openNewTodo ? <NewTodoList
            newListSent={handleNewDataSaved}
            handleCancelling={handleCancelling}
            openDialog={openNewTodo}/> : null}

        <Divider style={{marginBottom:"12px"}}/>
        <Grid container spacing={6}>
            {
                todoLists.map((item,index)=>{
                    return   <Grid item xs={12} md={3} key={item.id}>
                        <Card>
                            {openNewItem ? <NewItem todoID={selectedItem}
                                                    newListSent={handleNewDataSaved}
                                                    handleCancelling={handleCancelling}
                                                    openDialog={openNewItem}/> : null}
                            {deleteItem ? <DeleteComponent  deletingInfo="deleteItem" listID={selectedList}
                                                            todoID={selectedItem}
                                                            newListSent={handleNewDataSaved}
                                                            handleCancelling={handleCancelling}
                                                           openDialog={deleteItem}/> : null}
                            {deleteList ? <DeleteComponent deletingInfo="deleteList" listID={selectedList}
                                                           todoID={selectedItem}
                                                           newListSent={handleNewDataSaved}
                                                           handleCancelling={handleCancelling}
                                                           openDialog={deleteList}/> : null}
                            <List
                                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <div style={{display:"flex",background: "rgb(219 250 243)"}}>
                                        <ListSubheader style={{background: "rgb(219 250 243)"}}   id="nested-list-subheader">
                                            {item.Title}
                                        </ListSubheader>

                                        <div style={{    margin: "8px"}}>
                                            <Button  style={{minWidth:"30px"}} ><AddBox style={{fontSize:"18px"}}
                                                                                        onClick={()=>(updateOpenNewItem(true)
                                                ,updateSelectedItem(item.id))} /></Button>
                                            <Button style={{minWidth:"30px"}}><Delete style={{fontSize:"18px"}}
                                                                                      onClick={()=>(updateDeleteList(true),
                                                updateSelectedList(item.id))} color="error"/>
                                            </Button>
                                        </div>
                                    </div>
                                }>
                                {item.todos.map((todo) =>
                                            <div key={todo.id}>
                                                    <ListItem  style={todo.status=== 'Finished' ? {
                                                        textDecorationLine: 'line-through',
                                                        textDecorationStyle: 'solid'
                                                    } : null} key={todo.id}>
                                                        {todo.status !== 'notFinished' ?  <ListItemIcon>
                                                            <CheckCircle style={{color:'#2e7d32'}} />
                                                        </ListItemIcon> : null}
                                                        <ListItemText>{todo.name}</ListItemText>
                                                        <Tooltip title={todo.info}>
                                                            <Button style={{minWidth:"30px"}}  dense="true" size="small" color="primary">
                                                                <Info/>
                                                            </Button>
                                                        </Tooltip>
                                                        <Button style={{minWidth:"30px"}}
                                                                onClick={()=>(updateDeleteItem(true),
                                                            updateSelectedItem(todo.id),updateSelectedList(item.id))}
                                                                color="error">
                                                            <Delete/>
                                                        </Button>
                                                        <Button variant="outlined" style={{minWidth:"6px",width:"10px"}}
                                                                onClick={()=>changeStatus(todo.id,todo.status,item.id)}
                                                                color={todo.status === 'notFinished' ? "success": "warning"}>
                                                            {
                                                                todo.status === 'notFinished' ?
                                                                    <CheckBoxSharp style={{fontSize:"12px"}}/> :
                                                                    <Close style={{fontSize:"12px"}}/>
                                                            }
                                                        </Button>
                                                    </ListItem>
                                                    <Divider/>
                                            </div>

                                )}

                            </List>
                        </Card>
                    </Grid>
                })
            }
        </Grid>

    </Card>
)
}
export default Main