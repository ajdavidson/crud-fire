import app from "./index.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js"

const db = getFirestore(app);

//Form Element
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDes = document.getElementById("task-description");

// Card Element
const taskCard = document.getElementById("task-card");
//Update Flag
let editStatus = false;
let id = '';

//CREATE Section
const saveTask = (title, description) =>
    addDoc(collection(db, "tasks"), {
        title,
        description,
    });

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = taskTitle.value;
    const description = taskDes.value;
    console.log(title, description);

    if (!editStatus) {
        await saveTask(title, description);
    } else {
        await updateTask(id, {
            title: title,
            description: description,
        })

        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Save';
    }

    await getTasks();

    taskForm.reset();
    taskTitle.focus();
});

//READ Section
const getTasks = () => getDocs(collection(db, "tasks"));
const onGetTasks = (callback) => onSnapshot(collection(db, "tasks"), callback);
//Delete Section
const deleteTask = (id) => deleteDoc(doc(db, "tasks", id));
//UPDATE Section
const getTask = (id) => getDoc(doc(db, "tasks", id));
const updateTask = (id, updateTask) => updateDoc(doc(db, "tasks", id), updateTask);

//READ Section
window.addEventListener('DOMContentLoaded', async (e) => {
    onGetTasks((querySnapshot) => {
        taskCard.innerHTML = ' '
        querySnapshot.forEach((doc) => {
            console.log(doc.data());

            const task = doc.data();
            task.id = doc.id;

            taskCard.innerHTML += `<div class="card card-body mt-2 
            border-primary">
            <h3 class="h5"> ${task.title}</h3>
            <p> ${task.description}</p>
            <div>
                <button class="btn btn-danger btn-delete" data-id="${task.id}"> Delete </buttton>
                <button class="btn btn-primary btn-edit" data-id="${task.id}"> Edit </buttton>
            </div>
            </div>`
//DELETE SECTION

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {

                    await deleteTask(e.target.dataset.id);
                })

            })
//UPDATE SECTION
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getTask(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskTitle.value = task.title;
                    taskDes.value = task.description;
                    taskForm['btn-task-form'].innerText = 'Update';
                })
            })
        });
    })
})