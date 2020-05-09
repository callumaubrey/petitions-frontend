<template>
    <div>
    <Navbar></Navbar>
    <b-container>
        <div>
            <b-row>
                <b-col>
                    <b-form @submit.stop.prevent="refresh" inline style="margin-bottom:10px;">
                        <b-form-input v-model="form.query" placeholder="Search.."></b-form-input>
                        <b-button type="submit" variant="primary">Search</b-button>
                    </b-form>
                </b-col>
                <b-col>
                    <b-form-select v-on:change="refresh" v-model="selectedSort" :options="sortOptions"></b-form-select>
                </b-col>
                <b-col>
                    <b-form-select v-on:change="refresh" v-model="selectedCategory" :options="categories"></b-form-select>
                </b-col>
            </b-row>
            <table v-if="this.petitions" class="table table-borderless table-hover">
                <tr>
                    <th>Title</th>
                    <th>Descrption</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th># Signatures</th>
                </tr>
                <tr v-for="petition in this.petitions" @click="goToPetition(petition.petitionId)">
                    <td>{{ petition.title }}</td>
                    <td>{{ petition.description }}</td>
                    <td>{{ petition.category }}</td>
                    <td>{{ petition.authorName }}</td>
                    <td>{{ petition.signatureCount }}</td>
                </tr>
            </table>
            <ul class="pagination">
                <li class="page-item" v-if="currentPage > 1">
                    <a class="page-link" @click="prevPage()">Previous</a>
                </li>
                <li class="page-item" v-for="i in this.numPages">
                    <a class="page-link" style="background-color:#007bff;color:#fff;" v-if="currentPage == i" @click="goToPageN(i)">{{i}}</a>
                    <a v-else class="page-link"  @click="goToPageN(i)">{{i}}</a>
                </li>
                <li class="page-item" v-if="currentPage < numPages">
                    <a class="page-link" @click="nextPage()">Next</a>
                </li>
            </ul>
        </div>
    </b-container>
</div>
</template>

<script>
    import Navbar from './Navbar.vue';
    export default {
        components: {
            Navbar
        },
        data() {
            return {
                numPages: 1,
                perPage: 10,
                currentPage: 1,
                petitions: [],
                form: {
                    query: null
                },
                selectedSort: 'SIGNATURES_ASC',
                sortOptions: [
                    { value: 'ALPHABETICAL_ASC', text: 'Title ASC' },
                    { value: 'ALPHABETICAL_DESC', text: 'Title DESC' },
                    { value: 'SIGNATURES_ASC', text: 'Signatures ASC' },
                    { value: 'SIGNATURES_DESC', text: 'Signatures DESC' }
                ],
                selectedCategory: null,
                categories: []
            }
        },
        mounted() {
            this.calculateNumPages();
            this.fillPetitions();
            this.fillCategories();
        },
        methods: {
            goToPetition(petitionId) {
                this.$router.push('/petitions/' + petitionId);
            },
            goToPageN(n) {
                this.currentPage = n;
                this.refresh();
            },
            calculateNumPages() {
                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: {
                        'q': this.form.query,
                        'sortBy': this.selectedSort,
                        'categoryId': this.selectedCategory
                    }
                })
                .then((res) => {
                    this.numPages = Math.ceil(res.data.length / this.perPage);
                })
                .catch(err => alert(err));
            },
            fillPetitions() {
                this.axios.get('http://localhost:4941/api/v1/petitions', {
                    params: {
                        'q': this.form.query,
                        'sortBy': this.selectedSort,
                        'categoryId': this.selectedCategory,
                        'count': this.perPage,
                        'startIndex': (this.currentPage - 1) * this.perPage
                    }
                })
                .then((res) => {
                    this.petitions = res.data;
                })
                .catch(err => alert(err));
            },
            fillCategories() {
                this.axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((res) => {
                    this.categories.push({ value: null, text: 'Filter by category' });
                    for (var i = 0; i < res.data.length; i++) {
                        this.categories.push({ value: res.data[0].categoryId, text: res.data[0].name });
                    }
                })
                .catch(err => alert(err));
            },
            nextPage() {
                this.currentPage++;
                this.refresh();
            },
            prevPage() {
                this.currentPage--;
                this.refresh();
            },
            refresh() {
                this.fillPetitions();
                this.calculateNumPages();
            }
        },
        computed: {
            rows() {
                 return this.petitions.length;
            }
        }
    }
</script>
