<template>
    <section class="todoapp">
        <header class="header">
            <h1>Todos</h1>
            <input v-model="addMsg" @keyup.enter="add" class="new-todo" placeholder="What needs to be done?" autofocus />
        </header>

        <section class="main">
            <input id="toggle-all" class="toggle-all" type="checkbox" />
            <ul class="todo-list">
                <li v-for="(todo, i) in todos" :key="todo.id" :class="{ completed: todo.bool, editing: todo == myTodo }">
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.bool" />
                        <label @dblclick="edit(todo.skill)">{{ todo.skill }}</label>
                        <button class="destroy" @click="del(todo, i)"></button>
                    </div>
                    <input v-focus class="edit" type="text" />
                </li>
            </ul>
        </section>

        <!-- This footer should hidden by default and shown when there are todos -->
        <footer class="footer">
            <!-- This should be `0 items left` by default -->
            <span class="todo-count">
                <strong>{{ numLeft }}</strong>
                item left
            </span>
            <!-- Remove this if you don't implement routing -->
            <ul class="filters">
                <li><a @click="handleSelectAll" class="selected" href="#/">All</a></li>
                <li><a href="#/active">Active</a></li>
                <li><a href="#/completed">Completed</a></li>
            </ul>
            <!-- Hidden if no completed items are left ↓ -->
            <button @click="clear" class="clear-completed">Clear {{ numLeft }} completed</button>
        </footer>
    </section>
</template>

<script>
export default {
    name: 'TodosTwo',

    data() {
        return {
            addMsg: '',
            todos: JSON.parse(localStorage.getItem('todos') || '[]'),
            // todos:[
            // 	{id:1, skill:'学习vue', bool:true},
            // 	{id:2, skill:'学习react', bool:true},
            // 	{id:3, skill:'学习angular', bool:false}
            // ],
            showtext: '' // //是否显示输入框
        };
    },

    computed: {
        numLeft () {
            // 已完成数量
            return this.todos.filter(t => t.bool).length;
            // 未完成数量
            // return this.todos.filter(t=> !t.bool).length
        }

        // "filterTodos":function(){
        // 	let path = this.$route.path
        // 	if(path==='/'){
        // 		return this.todos
        // 	}else if(path==='/completed'){
        // 		return this.todos.filter(t=>t.bool)
        // 	}else{
        // 		return this.todos.filter(t=>!t.bool)
        // 	}
        // }
    },

    watch: {
        // 数组的深拷贝
        todos: {
            handler(newVal, oldVal) {
                localStorage.setItem('todos', JSON.stringify(newVal));
            },
            deep: true
        }
    },

    methods: {
        add() {
            let id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1;
            console.log(this.todos)
            this.todos.push({
                id,
                skill: this.addMsg,
                bool: false
            });
            console.log(this.todos)
            // 添加后清空
            this.addMsg = '';
        },

        del(todo, i) {
            // this.todos.splice(i, 1);
            this.todos.splice(i, 1);
            window.localStorage.setItem('todos', JSON.stringify(this.todos));
        },

        clear() {
            this.todos = this.todos.filter(item => item.bool === false);
            window.localStorage.setItem('todos', JSON.stringify(this.todos));
        }
    },

    // 定义input自动聚焦指令
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    }
};
</script>

<style></style>
