<template>
  <div>
    <h2>Exam Registration</h2>

    <input v-model="name" placeholder="Exam Name" />
    <input v-model="subject" placeholder="Subject" />
    <input v-model="className" placeholder="Class" />
    <input type="date" v-model="date" />

    <button @click="addExam">Add Exam</button>

    <hr />

    <ul>
      <li v-for="e in exams" :key="e._id">
        {{ e.name }} — {{ e.subject }} — Class {{ e.className }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      name: "",
      subject: "",
      className: "",
      date: "",
      exams: [],
    };
  },
  methods: {
    async loadExams() {
      const res = await api.get("/exams");
      this.exams = res.data;
    },
    async addExam() {
      await api.post("/exams", {
        name: this.name,
        subject: this.subject,
        className: this.className,
        date: this.date,
      });
      this.name = "";
      this.subject = "";
      this.className = "";
      this.date = "";
      this.loadExams();
    },
  },
  mounted() {
    this.loadExams();
  },
};
</script>
