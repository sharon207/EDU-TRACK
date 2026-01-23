<template>
  <div class="page">
    <h2 class="title">Course Work – {{ courseName }}</h2>

    <button class="back-btn" @click="$router.push('/teacher/dashboard')">← Back</button>

    <!-- Upload Form -->
    <div class="students-box">
      <h3>Add Work</h3>

      <input v-model="title" placeholder="Title" />

      <textarea v-model="description" placeholder="Description"></textarea>

      <input v-model="date" type="date" />

      <!-- File upload (URL only for now) -->
      <input v-model="fileUrl" placeholder="Upload File URL" />

      <!-- External link -->
      <input v-model="link" placeholder="External Link (optional)" />

      <button class="percent-btn" @click="uploadWork">Upload</button>
    </div>

    <!-- List of Works -->
    <div class="students-box">
      <h3>Uploaded Works</h3>

      <div v-if="works.length === 0">No work uploaded.</div>

      <ul>
        <li v-for="w in works" :key="w._id">
          <strong>{{ w.title }}</strong> ({{ formatDate(w.date) }}) <br />
          <small>{{ w.description }}</small>
          <br />

          <a v-if="w.fileUrl" :href="w.fileUrl" target="_blank">📄 File</a>
          <br />

          <a v-if="w.link" :href="w.link" target="_blank">🔗 Link</a>

          <hr />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CourseWork",

  data() {
    return {
      courseId: "",
      courseName: "",
      title: "",
      description: "",
      date: "",
      fileUrl: "",
      link: "",
      works: []
    };
  },

  methods: {
    formatDate(d) {
      return new Date(d).toLocaleDateString();
    },

    async loadWorks() {
      const res = await axios.get(
        `http://localhost:5000/api/coursework/${this.courseId}`
      );
      this.works = res.data;
    },

    async uploadWork() {
      if (!this.title || !this.date) {
        alert("Title and Date required");
        return;
      }

      await axios.post("http://localhost:5000/api/coursework", {
        courseId: this.courseId,
        title: this.title,
        description: this.description,
        date: this.date,
        fileUrl: this.fileUrl,
        link: this.link
      });

      alert("Work uploaded!");
      this.loadWorks();
    }
  },

  async mounted() {
    this.courseId = this.$route.params.id;

    const courseRes = await axios.get("http://localhost:5000/api/courses");
    const c = courseRes.data.find(x => x._id === this.courseId);
    this.courseName = c?.name || "";

    this.loadWorks();
  }
};
</script>
