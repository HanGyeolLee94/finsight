type TreeNode = {
  [key: string]: any;
  subRows?: TreeNode[]; // 자식 노드
};

type BuildTreeOptions = {
  parentKey: string; // 부모 키 컬럼명
  childKey: string; // 자식 키 컬럼명
  fullPathColumns?: { from: string; to: string }[]; // 컬럼 이름 매핑 배열 (from -> to)
  separator?: string; // 경로 구분자 (기본값: '>')
};

const buildTree = (data: any[], options: BuildTreeOptions): TreeNode[] => {
  const nodeMap: Record<string, TreeNode> = {}; // 노드를 childKey를 기준으로 맵핑
  const tree: TreeNode[] = []; // 최상위 노드들

  // 기본 구분자 설정 (디폴트는 '>'이고, 공백은 제외)
  const separator = options.separator ? ` ${options.separator} ` : " > ";

  // 첫 번째 단계: 모든 노드를 생성하고 nodeMap에 저장
  data.forEach((item) => {
    const node = {
      ...item,
      subRows: [], // 자식 노드 초기화
    };

    // fullPathColumns을 사용해 'from' 컬럼 값을 'to' 컬럼에 복사
    if (options.fullPathColumns) {
      options.fullPathColumns.forEach(({ from, to }) => {
        if (item[from] && !node[to]) {
          node[to] = item[from]; // 'from'의 값을 'to'로 복사
        }
      });
    }

    nodeMap[item[options.childKey]] = node; // childKey 기준으로 맵핑
  });

  // 두 번째 단계: 부모-자식 관계 설정 및 fullPath 컬럼 값 생성
  data.forEach((item) => {
    const parentId = item[options.parentKey];
    const parent = parentId ? nodeMap[parentId] : null;

    const node = nodeMap[item[options.childKey]]; // 해당 노드

    if (parent) {
      // 부모가 존재하면 subRows에 추가
      parent.subRows = parent.subRows || []; // subRows가 없으면 빈 배열로 초기화
      parent.subRows.push(node); // 자식 노드 추가

      // fullPathColumns을 사용해 경로 생성
      if (options.fullPathColumns) {
        options.fullPathColumns.forEach(({ from, to }) => {
          // 부모의 경로와 자식의 경로를 연결
          if (parent[to] && node[to]) {
            node[to] = `${parent[to]}${separator}${node[to]}`; // 경로 합치기
          }
        });
      }
    } else {
      // 부모가 없으면 최상위 노드에 추가
      tree.push(node);
    }
  });

  return tree;
};

export default buildTree;
