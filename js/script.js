(function ($) {
  "use strict";
  /*------------------------------------------
        = FLIP CARD
    -------------------------------------------*/
  var ar = [...$("p.text-story")];
  ar.forEach((element) => {
    if (element.clientHeight > element.parentNode.clientHeight) {
      element.classList.add("limit-text");
      element.nextElementSibling.classList.remove("d-none");
    }
  });
  /*------------------------------------------
        = DONATE MODAL
    -------------------------------------------*/
  if (
    $("#donate-modal").length &&
    $(".buttonDonate").length &&
    $(".donate-modal-close").length
  ) {
    $(document).on("click", ".buttonDonate", function () {
      $("#donate-modal").show();
      if ($("body").hasClass("offcanvas")) {
        $("body").removeClass("offcanvas");
        $(".js-oliven-nav-toggle").removeClass("active");
      }
    });
    $(document).on("click", ".donate-modal-close", function () {
      $("#donate-modal").hide();
    });
    $(document).on("click", "body", function (e) {
      if (e.target.id == $("#donate-modal").attr("id")) {
        $("#donate-modal").hide();
      }
    });
  }

  $(document).on("click", ".crypto-item", function () {
    let parent = $(this).parents(".donate-card");
    parent.find(".cryptos-box-view").show();
    parent
      .find(".cryptos-box-view .coin-img")
      .html('<img src="' + $(this).data("img") + '" />');
    parent.find(".cryptos-box-view .coin-id").html($(this).data("id"));
    parent
      .find(".cryptos-box-view .coin-address")
      .html($(this).data("address"));
    parent
      .find(".cryptos-box-view .coin-qr-code")
      .html("")
      .qrcode({ width: 150, height: 150, text: $(this).data("address") });
  });

  $(document).on("click", ".cryptos-box-view-close", function () {
    let parent = $(this).parents(".donate-card");
    parent.find(".cryptos-box-view").hide();
  });
  /*------------------------------------------
        = WISH FORM SUBMISSION
    -------------------------------------------*/
  if ($("#wish-form").length) {
    $("#wish-form").validate({
      rules: {
        name: {
          required: true,
        },
      },

      messages: {
        name: {
          required:
            '<span style="color:red;">Vui lòng nhập tên của bạn.</span>',
        },
      },

      submitHandler: function (form) {
        var submitUrl = window.__config?.submitUrl;
        if (!submitUrl) {
          return;
        }

        var data = {
          customer_type: $('input[name="customer_type"]:checked').val(),
          customer_name: $('input[name="customer_name"]').val() || "",
          customer_wishes: $('textarea[name="customer_wishes"]').val() || "",
          attend_status: $('input[name="attend_status"]:checked').val(),
        };
        var processXSS = function (val) {
          return (val || "")
            .replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;");
        };

        $("#loader").css("display", "inline-block");
        $.ajax({
          url: submitUrl,
          method: "GET",
          dataType: "json",
          data: data, // $(form).serialize()
          success: function (res) {
            $("#loader").hide();
            if (res && res["result"] == "success") {
              var message =
                '<div class="box-comment p-3 mb-3"><h4 id="user-name-comment">' +
                processXSS(data.customer_name) +
                '</h4><p id="comment-detail" class="m-0">' +
                processXSS(data.customer_wishes) +
                "</p></div>";
              $("#show-comments").scrollTop(0);
              $("#show-comments").prepend(message);
              $("#success").html(res.message).slideDown("slow");
              setTimeout(function () {
                $("#success").slideUp("slow");
              }, 5000);
            } else {
              $("#error")
                .html(res && res.message)
                .slideDown("slow");
              setTimeout(function () {
                $("#error").slideUp("slow");
              }, 5000);
            }

            form.reset();
          },
          error: function () {
            $("#loader").hide();
            $("#error").slideDown("slow");
            setTimeout(function () {
              $("#error").slideUp("slow");
            }, 5000);
          },
        });
        return false;
      },
    });
  }

  /*------------------------------------------
        = TOGGLE MUSUC BIX
    -------------------------------------------*/
  if ($(".music-box").length) {
    var musicBtn = $(".music-box-toggle-btn"),
      musicBox = $(".music-holder");

    musicBtn.on("click", function () {
      musicBox.toggleClass("toggle-music-box");
      return false;
    });
  }

  /*------------------------------------------
        = BACK TO TOP
    -------------------------------------------*/
  if ($(".back-to-top-btn").length) {
    $(".back-to-top-btn").on("click", function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        2000,
        "easeInOutExpo",
      );
      return false;
    });
  }

  $(document).on("click", ".calendar-button-custom-click", function (e) {
    e.preventDefault();
    $(this).parent().find(".calendar-button .atcb-click").click();
  });
})(window.jQuery);

$(document).ready(function () {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]',
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
  );
});

// Force reload for local images so updated uploads show immediately
(function () {
  const ts = Date.now();
  function isLocalSrc(src) {
    if (!src) return false;
    return (
      src.startsWith("./") ||
      src.startsWith("/") ||
      (!src.startsWith("http") && !src.startsWith("data:"))
    );
  }

  try {
    document.querySelectorAll("img").forEach((img) => {
      const s = img.getAttribute("src");
      if (isLocalSrc(s) && s.indexOf("?v=") === -1) {
        img.src = s + (s.indexOf("?") !== -1 ? "&" : "?") + "v=" + ts;
      }
    });

    document.querySelectorAll("[style]").forEach((el) => {
      const bg = el.style.backgroundImage || "";
      if (bg && bg.indexOf("url(") !== -1) {
        const m = bg.match(/url\(["']?(.+?)["']?\)/);
        if (m && isLocalSrc(m[1]) && m[1].indexOf("?v=") === -1) {
          const newUrl =
            m[1] + (m[1].indexOf("?") !== -1 ? "&" : "?") + "v=" + ts;
          el.style.backgroundImage = 'url("' + newUrl + '")';
        }
      }
    });
  } catch (e) {
    console.warn("Cache-bust images failed", e);
  }
})();
