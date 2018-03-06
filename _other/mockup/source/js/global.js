// include details.js polyfill
var details = require('./details');




(function(){
  'use strict';

  // global selectors and utility functions
  const avertApp = document.querySelector('.avert-app');

  function deselectElements(elements) {
    for (let i = 0; i < elements.length; ++i) {
      elements[i].setAttribute('data-active', 'false');
    }
  }

  function toggleAttribute(el, attr = 'active', opt1 = 'true', opt2 = 'false') {
    el.setAttribute('data-' + attr, el.getAttribute('data-' + attr) === opt1 ? opt2 : opt1);
  };




  function selectRegion(event) {
    if (event.target instanceof SVGElement) {
      const regionName = event.target.parentNode.getAttribute('data-name');
      console.log(regionName);
    }
  }

  avertApp.addEventListener('click', selectRegion, false);




  // set up avert button navigation
  const allTabs     = avertApp.querySelectorAll('.avert-nav a');
  const allSections = avertApp.querySelectorAll('.avert-step');

  function navigateToTab(event) {
    // delegate only to 'data-nav' elements
    if (!event.target.dataset.nav) { return; }
    event.preventDefault();

    const name    = event.target.dataset.nav;
    const tab     = avertApp.querySelector(`.avert-nav a[href="#${name}"]`);
    const section = avertApp.querySelector(`#${name}`);

    deselectElements(allTabs);
    tab.setAttribute('data-active', 'true');
    deselectElements(allSections);
    section.setAttribute('data-active', 'true');
  }

  avertApp.addEventListener('click', navigateToTab, false);




  // disable navigation for section tabs
  const tabNav = document.querySelector('.avert-nav');

  function disableAnchors(event) {
    if (event.target.nodeName !== 'A') { return; }
    event.preventDefault();
  }

  tabNav.addEventListener('click', disableAnchors, false);




  // geography filters for 'Results' step/tab
  const geoGroups  = avertApp.querySelector('#geography-groups');
  const geoFilters = avertApp.querySelectorAll('.avert-select-group');
  const geoState   = avertApp.querySelector('#geography-state');
  const geoCounty  = avertApp.querySelector('#geography-county');

  function displayFilteredSelect(event) {
    deselectElements(geoFilters);
    if (event.target.value === 'state') {
      geoState.setAttribute('data-active', 'true');
    }
    if (event.target.value === 'county') {
      geoState.setAttribute('data-active', 'true');
      geoCounty.setAttribute('data-active', 'true');
    }
  }

  geoGroups.addEventListener('change', displayFilteredSelect, false);




  // modals
  function openModal(event) {
    // delegate only to '.avert-modal-link' elements
    if (event.target.className !== 'avert-modal-link') { return; }
    event.preventDefault();

    const modal = avertApp.querySelector(event.target.hash);
    modal.setAttribute('data-active', 'true');

    avertApp.setAttribute('data-modal', 'active');
  }

  function closeModal(event) {
    // delegate only to '.avert-modal-close' elements
    if (event.target.className !== 'avert-modal-close') { return; }
    event.preventDefault();

    const modal = event.target.parentNode;
    modal.setAttribute('data-active', 'closed');

    avertApp.setAttribute('data-modal', 'inactive');
  }

  avertApp.addEventListener('click', openModal, false);
  avertApp.addEventListener('click', closeModal, false);
}());
