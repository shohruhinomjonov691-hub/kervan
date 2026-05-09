console.log("Branches frontend javascript file");

$(function () {
  // ── Status badge colors ──
  document.querySelectorAll(".branch-status-badge").forEach(function (badge) {
    var s = badge.getAttribute("data-status");
    var color =
      s === "OPEN" ? "#4caf82" : s === "TEMP_CLOSED" ? "#e3c285" : "#e05050";
    badge.querySelector(".branch-status-dot").style.background = color;
    badge.querySelector(".branch-status-txt").style.color = color;
  });

  // ── New branch form toggle ──
  $("#branch-btn").on("click", function () {
    $(".branch-form-container").slideToggle(500);
    $(this).css("display", "none");
  });

  $("#branch-cancel-btn").on("click", function () {
    $(".branch-form-container").slideToggle(100);
    $("#branch-btn").css("display", "flex");
  });

  // ── Branch status update ──
  $(".branch-status").on("change", async function (e) {
    const id = e.target.id;
    const branchStatus = $(`#${id}.branch-status`).val();
    try {
      const response = await axios.post("/admin/branch/edit", {
        _id: id,
        branchStatus: branchStatus,
      });
      const result = response.data;
      if (result.data) {
        $(".branch-status").blur();
      } else alert("Branch update failed!");
    } catch (err) {
      console.log(err);
      alert("Branch update failed!");
    }
  });

  // ── Edit modal: open ──
  $(".branch-edit-btn").on("click", function () {
    const btn = $(this);
    // Fill form with data-* values
    $("#edit-id").val(btn.data("id"));
    $("#edit-address").val(btn.data("address"));
    $("#edit-phone").val(btn.data("phone"));
    $("#edit-hours").val(btn.data("hours"));
    $("#edit-staff").val(btn.data("staff"));
    $("#edit-rating").val(btn.data("rating"));
    $("#edit-mapurl").val(btn.data("mapurl"));
    $("#edit-desc").val(btn.data("desc"));

    $("#edit-modal").fadeIn(200);
    $("body").css("overflow", "hidden");
  });

  // ── Edit modal: close ──
  function closeModal() {
    $("#edit-modal").fadeOut(200);
    $("body").css("overflow", "");
  }

  $("#modal-close, #modal-cancel").on("click", closeModal);

  // Close on overlay click
  $("#edit-modal").on("click", function (e) {
    if ($(e.target).is("#edit-modal")) closeModal();
  });

  // ── Edit form: submit ──
  $("#edit-branch-form").on("submit", async function (e) {
    e.preventDefault();

    const id = $("#edit-id").val();
    const payload = {
      _id: id,
      branchAddress: $("#edit-address").val(),
      branchPhone: $("#edit-phone").val(),
      branchHours: $("#edit-hours").val(),
      branchStaffCount: Number($("#edit-staff").val()),
      branchRating: Number($("#edit-rating").val()),
      branchMapUrl: $("#edit-mapurl").val(),
      branchDesc: $("#edit-desc").val(),
    };

    try {
      const response = await axios.post("/admin/branch/edit", payload);
      const result = response.data;
      if (result.data) {
        alert("Branch updated successfully!");
        closeModal();
        window.location.reload();
      } else {
        alert("Branch update failed!");
      }
    } catch (err) {
      console.log(err);
      alert("Branch update failed!");
    }
  });
});

// ── New branch form validation ──
function validateBranchForm() {
  const branchAddress = $("[name='branchAddress']").val(),
    branchPhone = $("[name='branchPhone']").val();

  if (branchAddress === "" || branchPhone === "") {
    alert("Please fill in all required fields!");
    return false;
  }
  return true;
}
