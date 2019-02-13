export default {
  test: ({ component, props }) =>
    component === 'div' &&
    props.className.split(' ').includes('infogram-embed'),
  process: ({ props: { 'data-id': id, 'data-title': title } }) => ({
    component: 'iframe',
    props: { src: `https://e.infogram.com/${id}?src=embed`, title },
  }),
};
