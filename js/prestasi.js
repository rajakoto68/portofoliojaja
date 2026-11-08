(function(){
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function clamp(v,min=0,max=1){return Math.max(min,Math.min(max,v))}
/* =========================================================
   ACHIEVEMENT / CERTIFICATE
========================================================= */

(function () {

  const section =
    document.getElementById(
      'prestasi'
    );


  if (
    !section
  ) {
    return;
  }


  const cards =
    [
      ...
      section.querySelectorAll(
        '.achievement-card'
      )
    ];


  const openButtons =
    [
      ...
      section.querySelectorAll(
        '.achievement-open'
      )
    ];


  const modal =
    document.getElementById(
      'certificateModal'
    );


  const modalImage =
    document.getElementById(
      'certificateViewerImage'
    );


  const modalTitle =
    document.getElementById(
      'certificateViewerTitle'
    );


  const modalNumber =
    document.getElementById(
      'certificateViewerNumber'
    );


  const closeButton =
    document.getElementById(
      'certificateClose'
    );


  const prevButton =
    document.getElementById(
      'certificatePrev'
    );


  const nextButton =
    document.getElementById(
      'certificateNext'
    );


  if (
    !modal
  ) {
    return;
  }


  const certificates = [

    {
      image:
        'img/sertifikat-01.jpg',

      title:
        'Prestasi Pertama'
    },

    {
      image:
        'img/sertifikat-02.jpg',

      title:
        'Prestasi Kedua'
    },

    {
      image:
        'img/sertifikat-03.jpg',

      title:
        'Prestasi Ketiga'
    }

  ];


  let certificateIndex =
    0;


  function openCertificate(
    index
  ) {

    certificateIndex =
      (
        index +
        certificates.length
      ) %
      certificates.length;


    const certificate =
      certificates[
        certificateIndex
      ];


    if (
      modalImage
    ) {

      modalImage.src =
        certificate.image;


      modalImage.alt =
        certificate.title;

    }


    if (
      modalTitle
    ) {

      modalTitle.textContent =
        certificate.title;

    }


    if (
      modalNumber
    ) {

      modalNumber.textContent =
        `${String(
          certificateIndex +
          1
        ).padStart(
          2,
          '0'
        )} / 03`;

    }


    modal.classList.add(
      'is-open'
    );


    modal.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body.style.overflow =
      'hidden';

  }


  function closeCertificate() {

    modal.classList.remove(
      'is-open'
    );


    modal.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body.style.overflow =
      '';

  }


  openButtons.forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          openCertificate(
            Number(
              button.dataset.index
            )
          );

        }
      );

    }
  );


  cards.forEach(
    (
      card,
      index
    ) => {

      const image =
        card.querySelector(
          '.achievement-image'
        );


      if (!image) {
        return;
      }


      image.style.cursor =
        'zoom-in';


      image.addEventListener(
        'click',
        () => {

          openCertificate(
            Number(
              card.dataset.index
            ) ||
            index
          );

        }
      );

    }
  );


  if (
    nextButton
  ) {

    nextButton.addEventListener(
      'click',
      () => {

        openCertificate(
          certificateIndex +
          1
        );

      }
    );

  }


  if (
    prevButton
  ) {

    prevButton.addEventListener(
      'click',
      () => {

        openCertificate(
          certificateIndex -
          1
        );

      }
    );

  }


  if (
    closeButton
  ) {

    closeButton.addEventListener(
      'click',
      closeCertificate
    );

  }


  modal.addEventListener(
    'click',
    event => {

      if (
        event.target.matches(
          '[data-close-certificate]'
        )
      ) {

        closeCertificate();

      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        !modal.classList.contains(
          'is-open'
        )
      ) {
        return;
      }


      if (
        event.key ===
        'Escape'
      ) {

        closeCertificate();

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        openCertificate(
          certificateIndex +
          1
        );

      }


      if (
        event.key ===
        'ArrowLeft'
      ) {

        openCertificate(
          certificateIndex -
          1
        );

      }

    }
  );


  if (
    !reduced
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                'is-visible'
              );

            }
          );

        },
        {
          threshold:
            0.18
        }
      );


    cards.forEach(
      card => {

        observer.observe(
          card
        );

      }
    );

  } else {

    cards.forEach(
      card => {

        card.classList.add(
          'is-visible'
        );

      }
    );

  }


  if (
    !reduced
  ) {

    cards.forEach(
      card => {

        card.addEventListener(
          'pointermove',
          event => {

            const rect =
              card.getBoundingClientRect();


            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width;


            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height;


            const rotateY =
              (
                x -
                0.5
              ) *
              5;


            const rotateX =
              (
                0.5 -
                y
              ) *
              5;


            if (
              window.innerWidth >
              850
            ) {

              if (
                card.classList.contains(
                  'achievement-card-two'
                )
              ) {

                card.style.transform =
                  `translateX(-50%) translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(2deg)`;

              } else {

                card.style.transform =
                  `translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

              }

            }

          }
        );


        card.addEventListener(
          'pointerleave',
          () => {

            if (
              window.innerWidth <=
              850
            ) {
              return;
            }


            if (
              card.classList.contains(
                'achievement-card-two'
              )
            ) {

              card.style.transform =
                'translateX(-50%) rotate(2deg)';

            } else {

              card.style.transform =
                'rotate(-2deg)';

            }

          }
        );

      }
    );

  }


  const achievementProgress =
    section.querySelector(
      '.achievement-progress i'
    );


  function updateAchievementProgress() {

    if (
      !achievementProgress
    ) {
      return;
    }


    const rect =
      section.getBoundingClientRect();


    const total =
      section.offsetHeight -
      window.innerHeight;


    const value =
      total > 0

        ? clamp(
            -rect.top /
            total
          )

        : 0;


    achievementProgress.style.width =
      `${Math.max(
        8,
        value *
        100
      )}%`;

  }


  window.addEventListener(
    'scroll',
    updateAchievementProgress,
    {
      passive: true
    }
  );


  updateAchievementProgress();

})();



})();

/* =========================================================
   ANIMASI MY JOURNEY — muncul halus saat di-scroll (ringan)
========================================================= */
(function () {
  var sec = document.getElementById('journey');
  if (!sec || !('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  sec.classList.add('jr-js');
  var targets = sec.querySelectorAll('.journey-header, .journey-item, .journey-footer');
  if (reduce) { targets.forEach(function (t) { t.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (t) { io.observe(t); });

  // garis timeline memanjang mengikuti scroll (1 variabel CSS, di-throttle rAF)
  var tl = sec.querySelector('.journey-timeline'), tick = false;
  function upd() {
    tick = false;
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    var p = (window.innerHeight * 0.65 - r.top) / r.height;
    tl.style.setProperty('--jp', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(upd); }
  }, { passive: true });
  window.addEventListener('resize', upd);
  upd();
})();
