console.log("Branches frontend javascript file");

$(function () {
  // ══════════════════════════════════════
  // 1. BOSHLANG'ICH RANGLAR
  // ══════════════════════════════════════

  // Select rangi
  document.querySelectorAll(".branch-status").forEach(function (sel) {
    var s = sel.getAttribute("data-status");
    sel.style.color =
      s === "OPEN" ? "#4caf82" : s === "TEMP_CLOSED" ? "#e3c285" : "#e05050";
  });

  // Badge rangi
  document.querySelectorAll(".branch-status-badge").forEach(function (badge) {
    var s = badge.getAttribute("data-status");
    var color =
      s === "OPEN" ? "#4caf82" : s === "TEMP_CLOSED" ? "#e3c285" : "#e05050";
    badge.querySelector(".branch-status-dot").style.background = color;
    badge.querySelector(".branch-status-txt").style.color = color;
  });

  // ══════════════════════════════════════
  // 2. STATUS O'ZGARGANDA — BITTA LISTENER
  // ══════════════════════════════════════

  document.querySelectorAll(".branch-status").forEach(function (sel) {
    sel.addEventListener("change", function () {
      var branchId = this.id;
      var newStatus = this.value;
      var self = this;

      var color =
        newStatus === "OPEN"
          ? "#4caf82"
          : newStatus === "TEMP_CLOSED"
            ? "#e3c285"
            : "#e05050";

      // Select rangi
      self.style.color = color;

      // Badge — data-branch-id orqali topiladi
      document
        .querySelectorAll(".branch-status-badge")
        .forEach(function (badge) {
          if (badge.getAttribute("data-branch-id") === branchId) {
            badge.querySelector(".branch-status-dot").style.background = color;
            badge.querySelector(".branch-status-txt").style.color = color;
            badge.querySelector(".branch-status-txt").textContent =
              newStatus === "TEMP_CLOSED" ? "TEMP CLOSED" : newStatus;
            badge.setAttribute("data-status", newStatus);
          }
        });

      // Server ga yuborish
      axios
        .post("/admin/branch/edit", {
          _id: branchId,
          branchStatus: newStatus,
        })
        .then(function (res) {
          if (!res.data.data) alert("Branch update failed!");
        })
        .catch(function () {
          alert("Failed to update branch status!");
          // Xato bo'lsa qaytarish
          self.value = self.getAttribute("data-status");
          self.style.color =
            self.getAttribute("data-status") === "OPEN"
              ? "#4caf82"
              : self.getAttribute("data-status") === "TEMP_CLOSED"
                ? "#e3c285"
                : "#e05050";
        });
    });
  });

  // ══════════════════════════════════════
  // 3. NEW BRANCH FORM TOGGLE
  // ══════════════════════════════════════

  $("#branch-btn").on("click", function () {
    $(".branch-form-container").slideToggle(500);
    $(this).css("display", "none");
  });

  $("#branch-cancel-btn").on("click", function () {
    $(".branch-form-container").slideToggle(100);
    $("#branch-btn").css("display", "flex");
  });

  // ══════════════════════════════════════
  // 4. EDIT MODAL — OPEN
  // ══════════════════════════════════════

  $(".branch-edit-btn").on("click", function () {
    var btn = $(this);
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

  // ══════════════════════════════════════
  // 5. EDIT MODAL — CLOSE
  // ══════════════════════════════════════

  function closeModal() {
    $("#edit-modal").fadeOut(200);
    $("body").css("overflow", "");
  }

  $("#modal-close, #modal-cancel").on("click", closeModal);

  $("#edit-modal").on("click", function (e) {
    if ($(e.target).is("#edit-modal")) closeModal();
  });

  // ══════════════════════════════════════
  // 6. EDIT FORM — SUBMIT
  // ══════════════════════════════════════

  $("#edit-branch-form").on("submit", async function (e) {
    e.preventDefault();

    var payload = {
      _id: $("#edit-id").val(),
      branchAddress: $("#edit-address").val(),
      branchPhone: $("#edit-phone").val(),
      branchHours: $("#edit-hours").val(),
      branchStaffCount: Number($("#edit-staff").val()),
      branchRating: Number($("#edit-rating").val()),
      branchMapUrl: $("#edit-mapurl").val(),
      branchDesc: $("#edit-desc").val(),
    };

    try {
      var response = await axios.post("/admin/branch/edit", payload);
      if (response.data.data) {
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

// ══════════════════════════════════════
// 7. NEW BRANCH FORM VALIDATION
// ══════════════════════════════════════

function validateBranchForm() {
  var branchAddress = $("[name='branchAddress']").val();
  var branchPhone = $("[name='branchPhone']").val();

  if (!branchAddress || !branchPhone) {
    alert("Please fill in all required fields!");
    return false;
  }
  return true;
}
