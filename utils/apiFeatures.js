class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedField = ["page", "sort", "limit", "fields", "search"];
    excludedField.forEach((el) => delete queryObj[el]);

    if (queryObj.jobType === "all") delete queryObj["jobType"];
    if (queryObj.status === "all") delete queryObj["status"];

    this.query = this.query.find(queryObj);
    if (this.queryString.search) {
      this.query = this.query.find({
        position: { $regex: new RegExp(this.queryString.search) },
      });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortValue = this.queryString.sort;
      if (sortValue === "latest") this.query = this.query.sort("-createAt");
      if (sortValue === "oldest") this.query = this.query.sort("createAt");
      else if (sortValue === "a-z") this.query = this.query.sort("position");
      else if (sortValue === "z-a") this.query = this.query.sort("-position");
    }
    return this;
  }

  pagination() {
    const page = +this.queryString.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
