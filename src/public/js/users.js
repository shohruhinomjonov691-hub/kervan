console.log("Users frontend javascript file");

$(function () {
  $(".member-status").on("change", function (e) {
    const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();
    // Axios updateChosenUser
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        console.log("response:", response);
        const result = response.data;

        if (result.data) {
          $(".member-status").blur();
          if (result.stats) {
            $("#stat-active").text(result.stats.activeCount);
            $("#stat-blocked").text(result.stats.blockCount);
            $("#stat-deleted").text(result.stats.deleteCount);
          }
        } else alert("User update failed!");
      })
      .catch((err) => {
        console.log(err);
        alert("User update failed !");
      });
  });
});
