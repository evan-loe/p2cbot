class PaginationEmbed {
  embedList;
  length;
  current;

  constructor(embedList = []) {
    this.embedList = embedList;
    this.length = embedList.length;
    this.current = 0;
  }

  addPages(embed) {
    if (Array.isArray(embed)) {
      this.embedList.forEach((page) => {
        this.embedList.push(page);
      });
      this.length += embed.length;
    } else {
      this.embedList.push(embed);
      this.length += 1;
    }
    return this;
  }

  nextPage() {
    if (this.current + 1 < this.length) {
      this.current += 1;
    } else {
      this.current = 0;
    }
    return this.embedList[this.current];
  }

  prevPage() {
    if (this.current > 0) {
      this.current -= 1;
    } else {
      this.current = this.length - 1;
    }
    return this.embedList[this.current];
  }

  render(startIdx = 0) {
    return this.embedList[startIdx];
  }

  addFooters() {
    this.embedList.forEach((page, index) => {
      page.setFooter(`Page ${index + 1} of ${this.length}`);
    });
    return this;
  }

  update(searchQuery, selDictType) {
    const paginate = searchQuery.resultToEmbed(selDictType);
    this.embedList = paginate.embedList;
    this.current = paginate.current;
    this.length = paginate.length;
    return paginate.embedList[this.current];
  }
}

module.exports = PaginationEmbed;
