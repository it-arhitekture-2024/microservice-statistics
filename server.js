const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4001;

const id = '6660433ca017b03692ce3621';

const services = [
    { name: 'user', url: `http://localhost:3000/web/users/${id}` },
    { name: 'grades', url: 'http://localhost:3000/web/grades' },
    { name: 'subjects', url: 'http://localhost:3000/web/subjects' },
];

const collectServiceStatistics = async (url, type) => {
    try {
        const response = await axios.get(url);
        const stats = response.data;
        switch (type) {
            case 'user':
                return processUserStatistics(stats);
            case 'grades':
                return processGradeStatistics(stats);
            case 'subjects':
                return processSubjectStatistics(stats);
            default:
                return stats;
        }
    } catch (error) {
        return {};
    }
};

const processUserStatistics = (user) => {
    const processedStats = {};
    if (user && user.age) {
        processedStats.age = user.age;
    } else {
        processedStats.age = 0;
    }
    return processedStats;
};

const processGradeStatistics = (stats) => {
    const processedStats = {};
    const grades = stats;

    if (grades && grades.length > 0) {
        const averageGrade = grades.reduce((sum, grade) => sum + grade.gradeValue, 0) / grades.length;
        processedStats.averageGrade = averageGrade;
    } else {
        processedStats.averageGrade = 0.0;
    }

    return processedStats;
};

const processSubjectStatistics = (stats) => {
    const processedStats = {};
    const subjects = stats;

    if (subjects && subjects.length > 0) {
        processedStats.totalSubjects = subjects.length;
    } else {
        processedStats.totalSubjects = 0;
    }

    return processedStats;
};

app.get('/', async (req, res) => {
    const results = {};
    await Promise.all(
        services.map(async service => {
            const stats = await collectServiceStatistics(service.url, service.name);
            results[service.name] = stats;
        })
    );

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Statistics service running on port ${PORT}`);
});
