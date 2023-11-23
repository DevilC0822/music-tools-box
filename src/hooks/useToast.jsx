const useToast = () => {
  const closeToast = () => {
    document.body.removeChild(document.getElementById('toast'));
  };

  // type = success, warning, error
  const openToast = (message, type, duration = 2000) => {
    document.body.appendChild(document.createRange().createContextualFragment(`
      <div class="toast toast-center toast-middle" id="toast">
        <div class="alert alert-${type}">
          <span>${message}</span>
        </div>
      </div>
    `));
    setTimeout(() => {
      closeToast();
    }, duration);
  };

  return { openToast, closeToast };
};

export default useToast;