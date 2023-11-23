const useLoading = () => {
  const closeLoading = () => {
    const dom = document.getElementById('loading');
    if (dom) {
      document.body.removeChild(document.getElementById('loading'));
    }
  };

  // type = ring
  const openLoading = (type = 'ring') => {
    closeLoading();
    document.body.appendChild(document.createRange().createContextualFragment(`
      <div id="loading">
        <div class="toast toast-center toast-middle z-[1111]">
          <span class="loading loading-${type} loading-lg text-primary"></span>
        </div>
        <div class="fixed inset-0 pointer-events-none	z-[999]" style="background-color: rgba(0, 0,0, 0.45);"></div>
      </div>
    `));
  };

  return { openLoading, closeLoading };
};

export default useLoading;