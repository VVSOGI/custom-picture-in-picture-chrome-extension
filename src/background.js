// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let usingVideoTabId;

function loadUsingVideoTabId() {
  chrome.storage.local.get(["usingVideoTabId"], (result) => {
    usingVideoTabId = result.usingVideoTabId;
  });
}

function executeScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId, allFrames: true },
    world: "MAIN",
    files: ["script.js"],
  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get({ optOutAnalytics: false }, () => {
    if (usingVideoTabId) {
      executeScript(usingVideoTabId);
    }

    const currentTab = tab.url;
    const youtubeVideo = currentTab && currentTab.split(".").find((item) => item === "youtube");

    if (youtubeVideo) {
      chrome.storage.local.set({ usingVideoTabId: tab.id });
      executeScript(tab.id);
    }
  });
});

loadUsingVideoTabId();
