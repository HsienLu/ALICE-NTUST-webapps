"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavItemController = function () {
    function NavItemController($filter, $rootScope, $scope, $element, dragulaService, NodeService, ProjectService, StudentDataService, $mdDialog) {
        var _this = this;

        _classCallCheck(this, NavItemController);

        this.$filter = $filter;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$element = $element;
        this.dragulaService = dragulaService;
        this.NodeService = NodeService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;
        this.$mdDialog = $mdDialog;
        this.$translate = this.$filter('translate');
        this.autoScroll = require('dom-autoscroller');

        this.expanded = false;

        this.item = this.ProjectService.idToNode[this.nodeId];
        this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
        this.nodeStatuses = this.StudentDataService.nodeStatuses;
        this.nodeStatus = this.nodeStatuses[this.nodeId];

        this.nodeTitle = this.showPosition ? this.ProjectService.nodeIdToNumber[this.nodeId] + ': ' + this.item.title : this.item.title;
        this.currentNode = this.StudentDataService.currentNode;
        this.previousNode = null;
        this.isCurrentNode = this.currentNode.id === this.nodeId;

        // whether this node is a planning node
        this.isPlanning = this.ProjectService.isPlanning(this.nodeId);

        // the array of nodes used for drag/drop planning sorting
        this.availablePlanningNodes = [];

        // whether the node is a planning node instance
        this.node = this.ProjectService.getNodeById(this.nodeId);
        this.isPlanningInstance = this.ProjectService.isPlanningInstance(this.nodeId);

        this.parentGroupId = null;

        /*
         * whether planning mode is on or off which determines if students
         * can edit planning related aspects of the project such as adding,
         * moving, or deleting planning steps.
         */
        this.planningMode = false;

        var parentGroup = this.ProjectService.getParentGroup(this.nodeId);

        if (parentGroup != null) {
            this.parentGroupId = parentGroup.id;
            this.isParentGroupPlanning = this.ProjectService.isPlanning(this.parentGroupId);
        }

        if (this.isPlanning) {
            /*
             * planning is enabled so we will get the available planning
             * nodes that can be used in this group
             */
            this.availablePlanningNodes = this.ProjectService.getAvailablePlanningNodes(this.nodeId);
        }

        if (this.isParentGroupPlanning) {

            if (parentGroup.planningMode) {
                // the parent is currently in planning mode
                this.planningMode = true;
            }

            /*
             * planning is enabled so we will get the available planning
             * nodes that can be used in this group
             */
            this.availablePlanningNodes = this.ProjectService.getAvailablePlanningNodes(this.parentGroupId);

            this.$scope.$watch(function () {
                // watch the position of this node
                return _this.ProjectService.nodeIdToNumber[_this.nodeId];
            }, function (value) {
                // the position has changed for this node so we will update it in the UI
                _this.nodeTitle = _this.showPosition ? _this.ProjectService.nodeIdToNumber[_this.nodeId] + ': ' + _this.item.title : _this.item.title;
            });
        }

        this.$scope.$watch(function () {
            return _this.StudentDataService.currentNode;
        }, function (newNode, oldNode) {
            _this.currentNode = newNode;
            _this.previousNode = oldNode;
            _this.isCurrentNode = _this.nodeId === newNode.id;
            var isPrev = false;

            if (_this.ProjectService.isApplicationNode(newNode.id)) {
                return;
            }

            if (oldNode) {
                isPrev = _this.nodeId === oldNode.id;

                if (_this.StudentDataService.previousStep) {
                    _this.$scope.$parent.isPrevStep = _this.nodeId === _this.StudentDataService.previousStep.id;
                }
            }

            if (_this.isGroup) {
                var prevNodeisGroup = !oldNode || _this.ProjectService.isGroupNode(oldNode.id);
                var prevNodeIsDescendant = _this.ProjectService.isNodeDescendentOfGroup(oldNode, _this.item);
                if (_this.isCurrentNode) {
                    _this.expanded = true;
                    if (prevNodeisGroup || !prevNodeIsDescendant) {
                        _this.zoomToElement();
                    }
                } else {
                    if (!prevNodeisGroup) {
                        if (prevNodeIsDescendant) {
                            _this.expanded = true;
                        } else {
                            _this.expanded = false;
                        }
                    }
                }
            } else {
                if (isPrev && _this.ProjectService.isNodeDescendentOfGroup(_this.item, newNode)) {
                    _this.zoomToElement();
                }
            }
        });

        this.$scope.$watch(function () {
            return _this.expanded;
        }, function (value) {
            _this.$scope.$parent.itemExpanded = value;
        });

        this.$scope.$watch(function () {
            return _this.planningMode;
        }, function (value) {
            _this.$scope.$parent.planningMode = value;
        });

        // a group node has turned on or off planning mode
        this.$rootScope.$on('togglePlanningMode', function (event, args) {

            // get the group node that has had its planning node changed
            var planningModeClickedNodeId = args.nodeId;
            var planningMode = args.planningMode;

            // get this node's parent group
            var parentGroup = _this.ProjectService.getParentGroup(_this.nodeId);
            var parentGroupId = null;

            if (parentGroup != null) {
                parentGroupId = parentGroup.id;
            }

            if (parentGroupId == planningModeClickedNodeId) {
                // the parent of this node has changed their planning mode
                _this.planningMode = planningMode;
            }
        });

        var dragId = 'planning_' + this.nodeId;
        // handle item drop events
        var dropEvent = dragId + '.drop-model';
        this.$scope.$on(dropEvent, function (el, target, source) {
            var nodeChangedId = target.data().nodeid;
            _this.planningNodeItemsChanged(nodeChangedId);
        });

        this.dragulaService.options(this.$scope, dragId, {
            moves: function moves(el, source, handle, sibling) {
                if (!_this.planningMode) {
                    return false;
                }

                var nodeId = el.getAttribute('data-nodeid');
                return _this.ProjectService.isPlanningInstance(nodeId);
            }
        });

        var drake = dragulaService.find(this.$scope, dragId).drake;

        // support scroll while dragging
        var scroll = this.autoScroll([document.querySelector('#content')], {
            margin: 30,
            pixels: 50,
            scrollWhenOutside: true,
            autoScroll: function autoScroll() {
                // Only scroll when the pointer is down, and there is a child being dragged
                return this.down && drake.dragging;
            }
        });
    }

    _createClass(NavItemController, [{
        key: 'getTemplateUrl',
        value: function getTemplateUrl() {
            return this.ProjectService.getThemePath() + '/themeComponents/navItem/navItem.html';
        }
    }, {
        key: 'zoomToElement',
        value: function zoomToElement() {
            var _this2 = this;

            setTimeout(function () {
                // smooth scroll to expanded group's page location
                var top = _this2.$element[0].offsetTop;
                var location = _this2.isGroup ? top - 32 : top - 80;
                var delay = 350;
                $('#content').animate({
                    scrollTop: location
                }, delay, 'linear');
            }, 500);
        }
    }, {
        key: 'itemClicked',
        value: function itemClicked(event) {
            if (this.isGroup) {
                this.expanded = !this.expanded;
                if (this.expanded) {
                    if (this.isCurrentNode) {
                        this.zoomToElement();
                    } else {
                        this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
                    }
                }
            } else {
                if (this.StudentDataService.planningMode) {
                    // Don't allow students to enter planning steps while in planning mode
                    this.$mdDialog.show(this.$mdDialog.alert().title(this.$translate('itemLocked')).textContent(this.$translate('planningModeStepsUnVisitable')).ariaLabel(this.$translate('itemLocked')).ok(this.$translate('ok')).targetEvent(event));
                } else {
                    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
                }
            }
        }
    }, {
        key: 'savePlanningNodeAddedEvent',


        /**
         * Save an event when planning node is added
         * @param planningNodeAdded
         */
        value: function savePlanningNodeAddedEvent(planningNodeAdded) {
            var componentId = null;
            var componentType = null;
            var category = "Planning";
            var eventName = "planningNodeAdded";
            var eventData = {
                nodeIdAdded: planningNodeAdded.id,
                planningNodeTemplateId: planningNodeAdded.planningNodeTemplateId
            };
            var eventNodeId = this.nodeId;
            this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
        }
    }, {
        key: 'getPlannindNodeMaxAllowed',


        /**
         * Returns the max times a planning node can be added to the project (-1 is
         * is returned if there is no limit)
         * @param planningNodeId
         */
        value: function getPlannindNodeMaxAllowed(planningNodeId) {
            var maxAddAllowed = -1; // by default, students can add as many instances as they want
            var planningGroupNode = null;
            if (this.isParentGroupPlanning) {
                planningGroupNode = this.ProjectService.getNodeById(this.parentGroupId);
            } else {
                planningGroupNode = this.ProjectService.getNodeById(this.nodeId);
            }
            // get the maxAddAllowed value by looking up the planningNode in the project.
            if (planningGroupNode && planningGroupNode.availablePlanningNodes) {
                for (var a = 0; a < planningGroupNode.availablePlanningNodes.length; a++) {
                    var availablePlanningNode = planningGroupNode.availablePlanningNodes[a];
                    if (availablePlanningNode.nodeId === planningNodeId && availablePlanningNode.max != null) {
                        maxAddAllowed = availablePlanningNode.max;
                    }
                }
            }

            return maxAddAllowed;
        }
    }, {
        key: 'getNumPlannindNodeInstances',


        /**
         * Returns the number of times a planning node has been added to the project
         * @param planningNodeId
         */
        value: function getNumPlannindNodeInstances(planningNodeId) {
            var numPlanningNodesAdded = 0; // keep track of number of instances
            // otherwise, see how many times the planning node template has been used.

            var planningGroupNode = null;
            if (this.isParentGroupPlanning) {
                planningGroupNode = this.ProjectService.getNodeById(this.parentGroupId);
            } else {
                planningGroupNode = this.ProjectService.getNodeById(this.nodeId);
            }

            // loop through the child ids in the planning group and see how many times they've been used
            if (planningGroupNode && planningGroupNode.ids) {
                for (var c = 0; c < planningGroupNode.ids.length; c++) {
                    var childPlanningNodeId = planningGroupNode.ids[c];
                    var childPlanningNode = this.ProjectService.getNodeById(childPlanningNodeId);
                    if (childPlanningNode != null && childPlanningNode.planningNodeTemplateId === planningNodeId) {
                        numPlanningNodesAdded++;
                    }
                }
            }

            return numPlanningNodesAdded;
        }
    }, {
        key: 'canAddPlanningNode',


        /**
         * Returns true iff this student can add the specified planning node.
         * Limits include reaching the max allowed count
         * @param planningNodeId
         */
        value: function canAddPlanningNode(planningNodeId) {
            var maxAddAllowed = this.getPlannindNodeMaxAllowed(planningNodeId);

            // if maxAddAllowed was not found or is set to 0, it means students can add as many as they want
            if (maxAddAllowed < 1) {
                return true;
            }

            var numPlanningNodesAdded = this.getNumPlannindNodeInstances(planningNodeId);

            return numPlanningNodesAdded < maxAddAllowed;
        }
    }, {
        key: 'addPlanningNodeInstanceInside',


        /**
         * Create a planning node instance and add it to the project
         * @param groupId the group the new planning node instance will be added to
         * @param templateNodeId the node id of the planning node template
         * @returns the planning node instance
         */
        value: function addPlanningNodeInstanceInside(nodeIdToInsertInside, templateNodeId) {
            // create the planning node instance
            var nextAvailablePlanningNodeId = this.StudentDataService.getNextAvailablePlanningNodeId();
            var planningNodeInstance = this.ProjectService.createPlanningNodeInstance(nodeIdToInsertInside, templateNodeId, nextAvailablePlanningNodeId);

            // add the planning node instance inside
            this.ProjectService.addPlanningNodeInstanceInside(nodeIdToInsertInside, planningNodeInstance);

            /*
             * update the node statuses so that a node status is created for
             * the new planning node instance
             */
            this.StudentDataService.updateNodeStatuses();

            // perform any necessary updating
            this.planningNodeChanged();

            // Save add planning node event
            this.savePlanningNodeAddedEvent(planningNodeInstance);

            return planningNodeInstance;
        }

        /**
         * Open the planning mode select dialog to choose a planning node template
         * to create a new planning instance
         * @param event the trigger event
         * @param targetNodeId the node to insert the new planning instance after or inside
         * @param insertInside boolean whether to insert the new planning instance
         * inside the target node (optional; default is after)
         */

    }, {
        key: 'addPlanningInstance',
        value: function addPlanningInstance(event, targetNodeId, insertInside) {
            // show dialog with list of planning nodes user can add to current group

            var choosePlanningItemTemplateUrl = this.ProjectService.getThemePath() + '/themeComponents/navItem/choosePlanningItem.html';
            var navitemCtrl = this;

            this.$mdDialog.show({
                parent: angular.element(document.body),
                locals: {
                    targetNodeId: targetNodeId,
                    insertInside: insertInside,
                    navitemCtrl: navitemCtrl
                },
                templateUrl: choosePlanningItemTemplateUrl,
                targetEvent: event,
                controller: ChoosePlanningItemController
            });

            function ChoosePlanningItemController($scope, $mdDialog, targetNodeId, insertInside, navitemCtrl) {
                $scope.navitemCtrl = navitemCtrl;
                $scope.targetNodeId = targetNodeId;
                $scope.insertInside = insertInside;

                $scope.addSelectedPlanningInstance = function (templateNodeId) {
                    if ($scope.insertInside) {
                        $scope.navitemCtrl.addPlanningNodeInstanceInside($scope.targetNodeId, templateNodeId);
                    } else {
                        $scope.navitemCtrl.addPlanningNodeInstanceAfter($scope.targetNodeId, templateNodeId);
                    }

                    $mdDialog.hide();
                };

                $scope.close = function () {
                    $mdDialog.hide();
                };
            }
            ChoosePlanningItemController.$inject = ["$scope", "$mdDialog", "targetNodeId", "insertInside", "navitemCtrl"];
        }
    }, {
        key: 'addPlanningNodeInstanceAfter',


        /**
         * Create a planning node instance and add it to the project after the specified nodeId
         * @param groupId the group the new planning node instance will be added to
         * @param nodeId the node id of the planning node template
         */
        value: function addPlanningNodeInstanceAfter(nodeIdToInsertAfter, templateNodeId) {

            var parentGroup = this.ProjectService.getParentGroup(nodeIdToInsertAfter);

            if (parentGroup != null) {
                var parentGroupId = parentGroup.id;

                // create the planning node instance
                var nextAvailablePlanningNodeId = this.StudentDataService.getNextAvailablePlanningNodeId();
                var planningNodeInstance = this.ProjectService.createPlanningNodeInstance(parentGroupId, templateNodeId, nextAvailablePlanningNodeId);

                // insert planning node instance after
                this.ProjectService.addPlanningNodeInstanceAfter(nodeIdToInsertAfter, planningNodeInstance);

                /*
                 * update the node statuses so that a node status is created for
                 * the new planning node instance
                 */
                this.StudentDataService.updateNodeStatuses();

                // perform any necessary updating
                this.planningNodeChanged();

                // Save add planning node event
                this.savePlanningNodeAddedEvent(planningNodeInstance);

                return planningNodeInstance;
            }
        }

        /**
         * Remove the planning node instance
         * @param planningNodeInstanceNodeId the planning node instance to remove
         * @param event the event that triggered the function call
         */

    }, {
        key: 'removePlanningNodeInstance',
        value: function removePlanningNodeInstance(planningNodeInstanceNodeId, event) {
            var _this3 = this;

            var confirm = this.$mdDialog.confirm().parent(angular.element(document.body)).title(this.$translate('areYouSureYouWantToDeleteThisItem')).textContent(this.$translate('noteAnyWorkYouHaveDoneOnThisItemWillBeLost')).ariaLabel(this.$translate('deleteItemFromProject')).targetEvent(event).ok(this.$translate('yes')).cancel(this.$translate('no'));

            this.$mdDialog.show(confirm).then(function () {
                // delete the node from the project
                _this3.ProjectService.deleteNode(planningNodeInstanceNodeId);

                // perform any necessary updating
                _this3.planningNodeChanged(_this3.parentGroupId);

                // Save remove planning node event
                var componentId = null;
                var componentType = null;
                var category = "Planning";
                var eventName = "planningNodeRemoved";
                var eventData = {
                    nodeIdRemoved: planningNodeInstanceNodeId
                };
                var eventNodeId = _this3.nodeId;
                _this3.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
            }, function () {});
        }

        /**
         * Get the node title
         * @param nodeId get the title for this node
         * @returns the title for the node
         */

    }, {
        key: 'getNodeTitle',
        value: function getNodeTitle(nodeId) {
            var node = this.ProjectService.idToNode[nodeId];
            var title = null;

            if (node != null) {
                title = node.title;
            }

            return title;
        }

        /**
         * Get the node description
         * @param nodeId get the description for this node
         * @returns the description for the node
         */

    }, {
        key: 'getNodeDescription',
        value: function getNodeDescription(nodeId) {
            var node = this.ProjectService.idToNode[nodeId];
            var description = null;

            if (node != null) {
                description = node.description;
            }

            return description;
        }

        /**
         * Move the planning node. If the other node is a group node, we will
         * insert this node as the first node in the group. If the other node is
         * a step node, we will insert this node after the other node.
         * @param otherNodeId the other node we will move this node inside or after
         */

    }, {
        key: 'movePlanningNode0',
        value: function movePlanningNode0(otherNodeId) {

            /*
             * check that this node is not the same as the other node.
             * if they are the same we don't need to do anything.
             */
            if (this.nodeId != otherNodeId) {
                if (this.ProjectService.isGroupNode(otherNodeId)) {
                    // insert this node inside the group node
                    this.ProjectService.movePlanningNodeInstanceInside(this.nodeId, otherNodeId);
                } else {
                    // insert this node after the other node
                    this.ProjectService.movePlanningNodeInstanceAfter(this.nodeId, otherNodeId);
                }

                // Save move planning node event
                var componentId = null;
                var componentType = null;
                var category = "Planning";
                var eventName = "planningNodeMoved";
                var eventData = {
                    nodeIdMoved: this.nodeId,
                    nodeIdMovedInsideOrAfter: otherNodeId
                };
                var eventNodeId = this.nodeId;
                this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
            }

            // perform any necessary updating
            this.planningNodeChanged();
        }

        /**
         * Move the planning node. If the other node is a group node, we will
         * insert this node as the first node in the group. If the other node is
         * a step node, we will insert this node after the other node.
         * @param otherNodeId the other node we will move this node inside or after
         */

    }, {
        key: 'movePlanningNode',
        value: function movePlanningNode(nodeIdToMove, nodeIdToMoveAfter) {

            /*
             * check that this node is not the same as the other node.
             * if they are the same we don't need to do anything.
             */
            if (nodeIdToMove != nodeIdToMoveAfter) {
                if (this.ProjectService.isGroupNode(nodeIdToMoveAfter)) {
                    // insert this node inside the group node
                    this.ProjectService.movePlanningNodeInstanceInside(nodeIdToMove, nodeIdToMoveAfter);
                } else {
                    // insert this node after the other node
                    this.ProjectService.movePlanningNodeInstanceAfter(nodeIdToMove, nodeIdToMoveAfter);
                }
            }

            // perform any necessary updating
            this.planningNodeChanged();
        }

        /**
         * Something related to planning has changed in the project. This
         * means a planning node was added, moved, or deleted.
         * @param param planningNodeId planning node id
         */

    }, {
        key: 'planningNodeChanged',
        value: function planningNodeChanged(planningNodeId) {
            this.savePlanningNodeChanges(planningNodeId);

            this.$rootScope.$broadcast('planningNodeChanged');
        }

        /**
        * Save the changed nodes in NodeState
        * @param param planningNodeId planning node id
        **/

    }, {
        key: 'savePlanningNodeChanges',
        value: function savePlanningNodeChanges(planningNodeId) {
            var nodeState = this.NodeService.createNewNodeState();
            var nodeId = planningNodeId ? planningNodeId : this.nodeId;
            nodeState.nodeId = nodeId;
            nodeState.isAutoSave = false;
            nodeState.isSubmit = false;

            var studentData = {};
            studentData.nodeId = nodeId;
            studentData.nodes = [];
            var planningNode = this.ProjectService.getNodeById(nodeId);
            studentData.nodes.push(planningNode); // add the planning node (group)
            // loop through the child ids in the planning group and save them also
            if (planningNode.ids != null) {
                for (var c = 0; c < planningNode.ids.length; c++) {
                    var childPlanningNodeId = planningNode.ids[c];
                    var childPlanningNode = this.ProjectService.getNodeById(childPlanningNodeId);
                    studentData.nodes.push(childPlanningNode);
                }
            }

            nodeState.studentData = studentData;
            var nodeStates = [];
            nodeStates.push(nodeState);
            this.StudentDataService.saveNodeStates(nodeStates);
        }

        /**
         * Toggle the planning mode on and off. Notify child nodes that
         * the planning mode has changed so they can act accordingly.
         */

    }, {
        key: 'togglePlanningMode',
        value: function togglePlanningMode() {
            /*if (this.StudentDataService.planningMode && !this.item.planningMode) {
                // Don't allow multiple concurrent planning modes.
                this.$translate('planningModeOnlyOnePlanningModeAllowed').then((planningModeOnlyOnePlanningModeAllowed) => {
                    alert(planningModeOnlyOnePlanningModeAllowed);
                });
                 return;
            }*/

            // toggle the planning mode
            //this.planningMode = !this.planningMode;
            this.item.planningMode = this.planningMode;

            // also toggle StudentDataService planning mode. This will be used to constrain the entire project when in planning mode.
            this.StudentDataService.planningMode = this.planningMode;

            // Save planning mode on/off event
            var componentId = null;
            var componentType = null;
            var category = "Planning";
            var eventName = this.planningMode ? "planningModeOn" : "planningModeOff";
            var eventData = {
                nodeId: this.nodeId
            };
            var eventNodeId = this.nodeId;
            this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);

            // notify the child nodes that the planning mode of this group node has changed
            this.$rootScope.$broadcast('togglePlanningMode', { nodeId: this.nodeId, planningMode: this.planningMode });
        }

        /**
         * The planning node's items array has changed
         * @param newValue the new value of the planning node's items array
         * @param oldValue the old value of the planning node's items array
         */

    }, {
        key: 'planningNodeItemsChanged',
        value: function planningNodeItemsChanged(nodeChangedId) {
            var index = this.item.ids.indexOf(nodeChangedId);
            var nodeIdAddedAfter = this.item.ids[index - 1];

            if (nodeIdAddedAfter) {
                // the node was moved after another node in the group
                this.movePlanningNode(nodeChangedId, nodeIdAddedAfter);
            } else {
                // the node was moved to the beginning of the group
                this.movePlanningNode(nodeChangedId, this.nodeId);
            }
        }
    }]);

    return NavItemController;
}();

NavItemController.$inject = ['$filter', '$rootScope', '$scope', '$element', 'dragulaService', 'NodeService', 'ProjectService', 'StudentDataService', '$mdDialog'];

exports.default = NavItemController;
//# sourceMappingURL=navItemController.js.map