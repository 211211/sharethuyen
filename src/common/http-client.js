class client {
  static get(url, data) {
    return $.getJSON(url, data);
  }

  static post(url, data) {
    return $.ajax({
      url: url,
      data: JSON.stringify(data),
      type: "post",
      dataType: "json",
      contentType: "application/json"
    });
  }

  static put(url, data) {
    return $.ajax({
      url: url,
      data: JSON.stringify(data),
      type: "put",
      dataType: "json",
      contentType: "application/json"
    });
  }

  static postFormData(url, formData) {
    return $.ajax({
      url: url,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "POST"
    });
  }

  static putFormData(url, formData) {
    return $.ajax({
      url: url,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "PUT"
    });
  }

  static delete(url) {
    return $.ajax({
      url: url,
      method: "DELETE"
    });
  }
}

export default client;
