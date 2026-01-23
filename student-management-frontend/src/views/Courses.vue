<template>
  <div>
    <h2>Add Course</h2>

    <input v-model="name" placeholder="Course Name" />
    <input type="date" v-model="startDate" />
    <input type="date" v-model="endDate" />

    <button @click="addCourse">Add Course</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return { name: "", startDate: "", endDate: "" };
  },
  methods: {
    async addCourse() {
      await axios.post("http://localhost:5000/api/courses", {
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate
      });
      alert("Course added");
    }
  }
};
</script>
