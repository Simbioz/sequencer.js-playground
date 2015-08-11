$(function() {
    var sequencer = new Sequencer();

    // Enqueue a simple synchronous action
    sequencer.do(function () { console.log("1st"); });

    // Waits for one second then performs an action after the delay has elapsed.
    // This also demonstrates "do" task chaining.
    sequencer.doWait(1000).do(function () { console.log("2nd after 1 second"); });

    // Waits until the provided handle is released
    sequencer.doWaitForHandle(function (handle) { setTimeout(handle.release, 3000); });

    // Another simple synchronous action
    sequencer.do(function () { console.log("3rd after waiting for handle for 3 seconds"); });

    // A jquery.transit transition (optional jquery.transit-extension)
    sequencer.doTransition($(".animated"), { scale: 2 });

    // Continues only after the transition is complete
    sequencer.do(function () { console.log("4th after jquery.transit transition is complete"); });
});
