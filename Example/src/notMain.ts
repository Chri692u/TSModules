//module notMain where {
// imports() --- imports nothing
// exposed(doTheThing, run) --- exposes the 2 public functions

function doTheThing() {
    console.log("Doing the thing")
}


function privateLogic() {
    return "this function is not exposed"
}

function privateFunction() {
    return "this function is not exposed"
}

// } --- module ending