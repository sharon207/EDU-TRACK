<template>
  <div class="page">
    <h2>Subject Management</h2>

    <!-- Select Course -->
    <select v-model="courseId" @change="loadSubjects">
      <option value="">Select Course</option>
      <option
        v-for="c in courses"
        :key="c._id"
        :value="c._id"
      >
        {{ c.name }}
      </option>
    </select>

    <!-- Add Subject -->
    <input
      v-model="name"
      placeholder="Subject Name"
    />

    <button @click="addSubject">
      Add Subject
    </button>

    <hr />

    <!-- Subject List -->
    <ul v-if="subjects.length">
      <li v-for="s in subjects" :key="s._id">
        {{ s.name }}
      </li>
    </ul>

    <p v-else-if="courseId">
      No subjects found for this course
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Subjects",

  data() {
    return {
      courses: [],
      courseId: "",
      name: "",
      subjects: []
    };
  },

  async mounted() {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      this.courses = res.data;
    } catch (err) {
      console.error("Failed to load courses", err);
    }
  },

  methods: {
    async loadSubjects() {
      if (!this.courseId) {
        this.subjects = [];
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/subjects/${this.courseId}`
        );
        this.subjects = res.data;
      } catch (err) {
        console.error("Failed to load subjects", err);
      }
    },

    async addSubject() {
      if (!this.courseId || !this.name) {
        alert("Select course and enter subject name");
        return;
      }

      try {
        await axios.post("http://localhost:5000/api/subjects", {
          name: this.name,
          courseId: this.courseId
        });

        this.name = "";
        this.loadSubjects();
        alert("Subject added successfully");

      } catch (err) {
        console.error("Add subject failed", err);
        alert("Failed to add subject");
      }
    }
  }
};
</script>

<style>
.page {
  padding: 20px;
  max-width: 400px;
}

select,
input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
}

button {
  padding: 8px 12px;
}
</style>
