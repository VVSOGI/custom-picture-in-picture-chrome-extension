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

loadUsingVideoTabId();

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get({ optOutAnalytics: false }, () => {
    const youtubeVideo = tab.url.split(".").find((item) => item === "youtube");
    if (youtubeVideo) {
      usingVideoTabId = tab.id;
      const files = ["script.js"];
      chrome.storage.local.set({ usingVideoTabId: tab.id });
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        world: "MAIN",
        files,
      });
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "switch":
      chrome.tabs.query({ active: true, currentWindow: true }, () => {
        loadUsingVideoTabId();
        if (usingVideoTabId) {
          const files = ["script.js"];
          chrome.scripting.executeScript({
            target: { tabId: usingVideoTabId },
            world: "MAIN",
            files,
          });
        }
      });
      break;
  }
});
