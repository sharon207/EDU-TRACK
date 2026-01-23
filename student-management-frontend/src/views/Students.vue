<template>
  <div>
    <h2>Students</h2>
    <router-link to="/add-student">
  <button>Add Student</button>
</router-link>


    <button @click="loadStudents">Load Students</button>

    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>Name</th>
          <th>Roll Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s._id">
          <td>{{ s.name }}</td>
          <td>{{ s.rollNumber }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="students.length === 0">No students found</p>
  </div>
</template>


<script>
import api from "../services/api";

export default {
  data() {
    return {
      students: [],
    };
  },
  methods: {
    async loadStudents() {
      console.log("Button clicked");
      try {
        const res = await api.get("/students");
        console.log("API Response:", res.data);
       this.students = [...res.data];
       

      } catch (err) {
        console.error("API Error:", err);
      }
    },
  },
};
</script>
